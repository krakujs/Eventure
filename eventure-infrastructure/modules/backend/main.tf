resource "aws_ecs_cluster" "backend" {
  name = "${var.name_prefix}-backend"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.name_prefix}-backend-cluster"
  }
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.name_prefix}-backend"
  retention_in_days = 30

  tags = {
    Name = "${var.name_prefix}-backend-logs"
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.name_prefix}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
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
          name  = "SPRING_PROFILES_ACTIVE"
          value = var.environment
        },
        {
          name  = "DOCUMENTDB_HOST"
          value = var.documentdb_endpoint
        },
        {
          name  = "DOCUMENTDB_PORT"
          value = tostring(var.documentdb_port)
        },
        {
          name  = "REDIS_HOST"
          value = var.elasticache_endpoint
        },
        {
          name  = "REDIS_PORT"
          value = tostring(var.elasticache_port)
        },
        {
          name  = "WEBSOCKET_URL"
          value = "wss://ws.${var.domain_name}"
        },
        {
          name  = "AWS_REGION"
          value = data.aws_region.current.name
        }
      ]
      
      secrets = [
        {
          name      = "DOCUMENTDB_USERNAME"
          valueFrom = aws_ssm_parameter.documentdb_username.arn
        },
        {
          name      = "DOCUMENTDB_PASSWORD"
          valueFrom = aws_ssm_parameter.documentdb_password.arn
        },
        {
          name      = "JWT_SECRET"
          valueFrom = aws_ssm_parameter.jwt_secret.arn
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "ecs"
        }
      }
      
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.container_port}/actuator/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name = "${var.name_prefix}-backend-task"
  }
}

resource "aws_lb" "backend" {
  name               = "${var.name_prefix}-backend-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnets

  enable_deletion_protection = var.environment == "prod" ? true : false

  tags = {
    Name = "${var.name_prefix}-backend-alb"
  }
}

resource "aws_lb_target_group" "backend" {
  name        = "${var.name_prefix}-backend-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    interval            = 30
    path                = "/actuator/health"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    matcher             = "200"
  }

  tags = {
    Name = "${var.name_prefix}-backend-tg"
  }
}

resource "aws_lb_listener" "backend_http" {
  load_balancer_arn = aws_lb.backend.arn
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

resource "aws_lb_listener" "backend_https" {
  count             = var.enable_ssl ? 1 : 0
  load_balancer_arn = aws_lb.backend.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

resource "aws_route53_record" "backend" {
  zone_id = var.route53_zone_id
  name    = "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_lb.backend.dns_name
    zone_id                = aws_lb.backend.zone_id
    evaluate_target_health = true
  }
}

resource "aws_ecs_service" "backend" {
  name                              = "${var.name_prefix}-backend"
  cluster                           = aws_ecs_cluster.backend.id
  task_definition                   = aws_ecs_task_definition.backend.arn
  desired_count                     = var.desired_count
  launch_type                       = "FARGATE"
  platform_version                  = "LATEST"
  health_check_grace_period_seconds = 120

  network_configuration {
    subnets          = var.app_subnets
    security_groups  = [var.backend_security_group_id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
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
    aws_lb_listener.backend_http,
    aws_lb_listener.backend_https
  ]

  tags = {
    Name = "${var.name_prefix}-backend-service"
  }
}

resource "aws_appautoscaling_target" "backend" {
  max_capacity       = 8
  min_capacity       = var.desired_count
  resource_id        = "service/${aws_ecs_cluster.backend.name}/${aws_ecs_service.backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "backend_cpu" {
  name               = "${var.name_prefix}-backend-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend.resource_id
  scalable_dimension = aws_appautoscaling_target.backend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

resource "aws_appautoscaling_policy" "backend_memory" {
  name               = "${var.name_prefix}-backend-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend.resource_id
  scalable_dimension = aws_appautoscaling_target.backend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

resource "aws_appautoscaling_policy" "backend_alb_requests" {
  name               = "${var.name_prefix}-backend-alb-requests-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend.resource_id
  scalable_dimension = aws_appautoscaling_target.backend.scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ALBRequestCountPerTarget"
      resource_label         = "${aws_lb.backend.arn_suffix}/${aws_lb_target_group.backend.arn_suffix}"
    }
    target_value = 2000.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

resource "aws_ssm_parameter" "documentdb_username" {
  name        = "/${var.name_prefix}/backend/documentdb_username"
  description = "DocumentDB username for the backend"
  type        = "SecureString"
  value       = var.documentdb_username

  tags = {
    Name = "${var.name_prefix}-documentdb-username"
  }
}

resource "aws_ssm_parameter" "documentdb_password" {
  name        = "/${var.name_prefix}/backend/documentdb_password"
  description = "DocumentDB password for the backend"
  type        = "SecureString"
  value       = var.documentdb_password

  tags = {
    Name = "${var.name_prefix}-documentdb-password"
  }
}

resource "aws_ssm_parameter" "jwt_secret" {
  name        = "/${var.name_prefix}/backend/jwt_secret"
  description = "JWT secret for the backend"
  type        = "SecureString"
  value       = random_password.jwt_secret.result

  tags = {
    Name = "${var.name_prefix}-jwt-secret"
  }
}

resource "random_password" "jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_iam_role" "ecs_execution" {
  name = "${var.name_prefix}-backend-execution-role"

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
    Name = "${var.name_prefix}-backend-execution-role"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_policy" "ecs_execution_ssm" {
  name        = "${var.name_prefix}-backend-execution-ssm-policy"
  description = "Allow ECS execution role to access SSM parameters"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "ssm:GetParameters",
        "secretsmanager:GetSecretValue",
        "kms:Decrypt"
      ]
      Effect = "Allow"
      Resource = [
        aws_ssm_parameter.documentdb_username.arn,
        aws_ssm_parameter.documentdb_password.arn,
        aws_ssm_parameter.jwt_secret.arn
      ]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_ssm" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = aws_iam_policy.ecs_execution_ssm.arn
}

resource "aws_iam_role" "ecs_task" {
  name = "${var.name_prefix}-backend-task-role"

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
    Name = "${var.name_prefix}-backend-task-role"
  }
}

resource "aws_iam_policy" "backend_task" {
  name        = "${var.name_prefix}-backend-task-policy"
  description = "Policy for Backend ECS Task"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject"
        ]
        Effect   = "Allow"
        Resource = [
          "${var.assets_bucket_arn}",
          "${var.assets_bucket_arn}/*"
        ]
      },
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
        Resource = var.dynamodb_table_arns
      },
      {
        Action = [
          "sqs:SendMessage",
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Effect   = "Allow"
        Resource = var.sqs_queue_arns
      },
      {
        Action = [
          "sns:Publish"
        ]
        Effect   = "Allow"
        Resource = var.sns_topic_arns
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "backend_task" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.backend_task.arn
}

resource "aws_wafv2_web_acl_association" "backend" {
  count        = var.waf_web_acl_arn != "" ? 1 : 0
  resource_arn = aws_lb.backend.arn
  web_acl_arn  = var.waf_web_acl_arn
}

data "aws_region" "current" {}