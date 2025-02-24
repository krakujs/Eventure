resource "aws_ecs_cluster" "websocket" {
  name = "${var.name_prefix}-websocket"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.name_prefix}-websocket-cluster"
  }
}

resource "aws_cloudwatch_log_group" "websocket" {
  name              = "/ecs/${var.name_prefix}-websocket"
  retention_in_days = 30

  tags = {
    Name = "${var.name_prefix}-websocket-logs"
  }
}

resource "aws_ecs_task_definition" "websocket" {
  family                   = "${var.name_prefix}-websocket"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "websocket"
      image     = var.container_image
      essential = true
      
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = var.environment
        },
        {
          name  = "MONGODB_URI"
          value = "mongodb://${var.documentdb_username}:${var.documentdb_password}@${var.documentdb_endpoint}:${var.documentdb_port}/${var.name_prefix}?retryWrites=false"
        },
        {
          name  = "DYNAMODB_TABLE"
          value = var.dynamodb_table_name
        },
        {
          name  = "AWS_REGION"
          value = data.aws_region.current.name
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.websocket.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }
      
      healthCheck = {
        command     = ["CMD-SHELL", "wget -q -O - http://localhost:${var.container_port}/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name = "${var.name_prefix}-websocket-task"
  }
}

resource "aws_lb" "websocket" {
  name               = "${var.name_prefix}-websocket-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnets

  enable_deletion_protection = var.environment == "prod" ? true : false

  tags = {
    Name = "${var.name_prefix}-websocket-alb"
  }
}

resource "aws_lb_target_group" "websocket" {
  name        = "${var.name_prefix}-websocket-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    interval            = 30
    path                = "/health"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    matcher             = "200"
  }

  tags = {
    Name = "${var.name_prefix}-websocket-tg"
  }
}

resource "aws_lb_listener" "websocket_http" {
  load_balancer_arn = aws_lb.websocket.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "websocket_https" {
  count             = var.enable_ssl ? 1 : 0
  load_balancer_arn = aws_lb.websocket.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.websocket.arn
  }
}

resource "aws_route53_record" "websocket" {
  zone_id = var.route53_zone_id
  name    = "ws.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.websocket.dns_name
    zone_id                = aws_lb.websocket.zone_id
    evaluate_target_health = true
  }
}

resource "aws_ecs_service" "websocket" {
  name                              = "${var.name_prefix}-websocket"
  cluster                           = aws_ecs_cluster.websocket.id
  task_definition                   = aws_ecs_task_definition.websocket.arn
  desired_count                     = var.desired_count
  launch_type                       = "FARGATE"
  platform_version                  = "LATEST"
  health_check_grace_period_seconds = 120

  network_configuration {
    subnets          = var.app_subnets
    security_groups  = [var.websocket_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.websocket.arn
    container_name   = "websocket"
    container_port   = var.container_port
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  deployment_controller {
    type = "ECS"
  }

  depends_on = [
    aws_lb_listener.websocket_http,
    aws_lb_listener.websocket_https
  ]

  tags = {
    Name = "${var.name_prefix}-websocket-service"
  }
}

resource "aws_appautoscaling_target" "websocket" {
  max_capacity       = 8
  min_capacity       = var.desired_count
  resource_id        = "service/${aws_ecs_cluster.websocket.name}/${aws_ecs_service.websocket.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "websocket_cpu" {
  name               = "${var.name_prefix}-websocket-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.websocket.resource_id
  scalable_dimension = aws_appautoscaling_target.websocket.scalable_dimension
  service_namespace  = aws_appautoscaling_target.websocket.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

resource "aws_appautoscaling_policy" "websocket_memory" {
  name               = "${var.name_prefix}-websocket-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.websocket.resource_id
  scalable_dimension = aws_appautoscaling_target.websocket.scalable_dimension
  service_namespace  = aws_appautoscaling_target.websocket.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

resource "aws_appautoscaling_policy" "websocket_alb_requests" {
  name               = "${var.name_prefix}-websocket-alb-requests-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.websocket.resource_id
  scalable_dimension = aws_appautoscaling_target.websocket.scalable_dimension
  service_namespace  = aws_appautoscaling_target.websocket.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ALBRequestCountPerTarget"
      resource_label         = "${aws_lb.websocket.arn_suffix}/${aws_lb_target_group.websocket.arn_suffix}"
    }
    target_value = 1000.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

resource "aws_iam_role" "ecs_execution" {
  name = "${var.name_prefix}-websocket-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  tags = {
    Name = "${var.name_prefix}-websocket-execution-role"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task" {
  name = "${var.name_prefix}-websocket-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  tags = {
    Name = "${var.name_prefix}-websocket-task-role"
  }
}

resource "aws_iam_policy" "websocket_task" {
  name        = "${var.name_prefix}-websocket-task-policy"
  description = "Policy for WebSocket ECS Task"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect   = "Allow"
        Resource = [
          var.dynamodb_table_arn,
          "${var.dynamodb_table_arn}/index/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "websocket_task" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.websocket_task.arn
}

data "aws_region" "current" {}