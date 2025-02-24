locals {
  lambda_functions = {
    event_processor = {
      name          = "event-processor"
      handler       = "index.handler"
      timeout       = 30
      memory_size   = 256
      runtime       = "nodejs18.x"
      architectures = ["x86_64"]
      description   = "Processes events from SQS queue"
      source_dir    = "${path.module}/functions/event_processor"
      environment   = {
        DOCUMENTDB_URI  = "mongodb://${var.documentdb_username}:${var.documentdb_password}@${var.documentdb_endpoint}:${var.documentdb_port}/${var.name_prefix}?retryWrites=false"
        REDIS_HOST      = var.elasticache_endpoint
        REDIS_PORT      = var.elasticache_port
        DYNAMODB_TABLE  = var.dynamodb_table_name
      }
    },
    notification_sender = {
      name          = "notification-sender"
      handler       = "index.handler"
      timeout       = 30
      memory_size   = 256
      runtime       = "nodejs18.x"
      architectures = ["x86_64"]
      description   = "Sends notifications to clients"
      source_dir    = "${path.module}/functions/notification_sender"
      environment   = {
        DOCUMENTDB_URI  = "mongodb://${var.documentdb_username}:${var.documentdb_password}@${var.documentdb_endpoint}:${var.documentdb_port}/${var.name_prefix}?retryWrites=false"
        DYNAMODB_TABLE  = var.dynamodb_table_name
      }
    },
    scheduled_tasks = {
      name          = "scheduled-tasks"
      handler       = "index.handler"
      timeout       = 60
      memory_size   = 512
      runtime       = "nodejs18.x"
      architectures = ["x86_64"]
      description   = "Runs scheduled tasks"
      source_dir    = "${path.module}/functions/scheduled_tasks"
      environment   = {
        DOCUMENTDB_URI  = "mongodb://${var.documentdb_username}:${var.documentdb_password}@${var.documentdb_endpoint}:${var.documentdb_port}/${var.name_prefix}?retryWrites=false"
      }
    }
  }
}

# Creating placeholder source directories and files
resource "local_file" "lambda_source" {
  for_each = local.lambda_functions
  content  = <<-EOT
// Placeholder Lambda function for ${each.value.name}
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Process the event here
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  };
};
EOT

  filename = "${path.module}/functions/${each.key}/index.js"

  provisioner "local-exec" {
    command = "mkdir -p ${dirname(self.filename)}"
    interpreter = ["bash", "-c"]
  }
}

data "archive_file" "lambda_zip" {
  for_each = local.lambda_functions
  
  type        = "zip"
  output_path = "${path.module}/functions/${each.key}.zip"
  source_dir  = "${path.module}/functions/${each.key}"
  
  depends_on = [local_file.lambda_source]
}

resource "aws_lambda_function" "function" {
  for_each = local.lambda_functions
  
  function_name    = "${var.name_prefix}-${each.value.name}"
  filename         = "${path.module}/functions/${each.key}.zip"
  handler          = each.value.handler
  role             = aws_iam_role.lambda_role.arn
  runtime          = each.value.runtime
  timeout          = each.value.timeout
  memory_size      = each.value.memory_size
  architectures    = each.value.architectures
  description      = each.value.description
  source_code_hash = data.archive_file.lambda_zip[each.key].output_base64sha256
  
  vpc_config {
    subnet_ids         = var.app_subnets
    security_group_ids = [var.lambda_security_group_id]
  }
  
  environment {
    variables = each.value.environment
  }
  
  tracing_config {
    mode = "Active"
  }
  
  tags = {
    Name        = "${var.name_prefix}-${each.value.name}"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "lambda_logs" {
  for_each = local.lambda_functions
  
  name              = "/aws/lambda/${var.name_prefix}-${each.value.name}"
  retention_in_days = 14
  
  tags = {
    Name        = "${var.name_prefix}-${each.value.name}-logs"
    Environment = var.environment
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.name_prefix}-lambda-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
  
  tags = {
    Name        = "${var.name_prefix}-lambda-role"
    Environment = var.environment
  }
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.name_prefix}-lambda-policy"
  description = "Policy for Lambda functions"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          var.dynamodb_table_arn,
          "${var.dynamodb_table_arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
          "sqs:ChangeMessageVisibility"
        ]
        Resource = var.sqs_queue_arn
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = var.sns_topic_arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = var.sqs_queue_arn
  function_name    = aws_lambda_function.function["event_processor"].arn
  batch_size       = 10
  enabled          = true
}

resource "aws_lambda_permission" "allow_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.function["notification_sender"].function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.sns_topic_arn
}

resource "aws_sns_topic_subscription" "lambda_subscription" {
  topic_arn = var.sns_topic_arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.function["notification_sender"].arn
}

resource "aws_cloudwatch_event_rule" "scheduled_task" {
  name                = "${var.name_prefix}-scheduled-task-rule"
  description         = "Run scheduled tasks daily"
  schedule_expression = "cron(0 0 * * ? *)" # Run at midnight UTC every day
  
  tags = {
    Name        = "${var.name_prefix}-scheduled-task-rule"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_event_target" "scheduled_task_target" {
  rule      = aws_cloudwatch_event_rule.scheduled_task.name
  target_id = "ScheduledTasksLambda"
  arn       = aws_lambda_function.function["scheduled_tasks"].arn
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.function["scheduled_tasks"].function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.scheduled_task.arn
}