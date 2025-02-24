resource "aws_docdb_subnet_group" "main" {
  name       = "${var.name_prefix}-docdb-subnet-group"
  subnet_ids = var.data_subnets

  tags = {
    Name = "${var.name_prefix}-docdb-subnet-group"
  }
}

resource "aws_docdb_cluster_parameter_group" "main" {
  family      = "docdb4.0"
  name        = "${var.name_prefix}-docdb-param-group"
  description = "Parameter group for ${var.name_prefix} DocumentDB cluster"

  parameter {
    name  = "tls"
    value = "enabled"
  }

  tags = {
    Name = "${var.name_prefix}-docdb-param-group"
  }
}

resource "aws_docdb_cluster" "main" {
  cluster_identifier              = "${var.name_prefix}-docdb"
  engine                          = "docdb"
  master_username                 = var.documentdb_username
  master_password                 = var.documentdb_password
  backup_retention_period         = var.backup_retention_days
  preferred_backup_window         = "02:00-04:00"
  preferred_maintenance_window    = "sun:04:00-sun:06:00"
  skip_final_snapshot             = var.environment != "prod"
  final_snapshot_identifier       = var.environment == "prod" ? "${var.name_prefix}-docdb-final-snapshot" : null
  db_subnet_group_name            = aws_docdb_subnet_group.main.name
  vpc_security_group_ids          = [var.documentdb_security_group_id]
  storage_encrypted               = true
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main.name
  deletion_protection             = var.environment == "prod"
  apply_immediately               = var.environment != "prod"

  tags = {
    Name = "${var.name_prefix}-docdb-cluster"
  }
}

resource "aws_docdb_cluster_instance" "main" {
  count              = var.documentdb_instance_count
  identifier         = "${var.name_prefix}-docdb-instance-${count.index + 1}"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.documentdb_instance_class
  apply_immediately  = var.environment != "prod"
  tags = {
    Name = "${var.name_prefix}-docdb-instance-${count.index + 1}"
  }
}

resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.name_prefix}-redis-subnet-group"
  subnet_ids = var.data_subnets

  tags = {
    Name = "${var.name_prefix}-redis-subnet-group"
  }
}

resource "aws_elasticache_parameter_group" "main" {
  name        = "${var.name_prefix}-redis-param-group"
  family      = "redis6.x"
  description = "Parameter group for ${var.name_prefix} Redis cluster"

  parameter {
    name  = "maxmemory-policy"
    value = "volatile-lru"
  }

  tags = {
    Name = "${var.name_prefix}-redis-param-group"
  }
}

resource "aws_elasticache_replication_group" "main" {
  replication_group_id       = "${var.name_prefix}-redis"
  description                = "Redis cluster for ${var.name_prefix}"
  node_type                  = var.elasticache_node_type
  num_cache_clusters         = var.elasticache_node_count
  parameter_group_name       = aws_elasticache_parameter_group.main.name
  subnet_group_name          = aws_elasticache_subnet_group.main.name
  security_group_ids         = [var.elasticache_security_group_id]
  port                       = 6379
  automatic_failover_enabled = var.elasticache_node_count > 1
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  apply_immediately          = var.environment != "prod"
  snapshot_retention_limit   = var.backup_retention_days
  snapshot_window            = "03:00-05:00"
  maintenance_window         = "sun:06:00-sun:08:00"

  tags = {
    Name = "${var.name_prefix}-redis-cluster"
  }
}

resource "aws_dynamodb_table" "websocket_connections" {
  name           = "${var.name_prefix}-websocket-connections"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "connectionId"
  stream_enabled = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "connectionId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name               = "UserIdIndex"
    hash_key           = "userId"
    projection_type    = "ALL"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = "${var.name_prefix}-websocket-connections"
  }
}

resource "aws_dynamodb_table" "chat_rooms" {
  name           = "${var.name_prefix}-chat-rooms"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "roomId"
  stream_enabled = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "roomId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name               = "UserIdIndex"
    hash_key           = "userId"
    projection_type    = "ALL"
  }

  tags = {
    Name = "${var.name_prefix}-chat-rooms"
  }
}

resource "aws_s3_bucket" "assets" {
  bucket = "${var.name_prefix}-assets"

  tags = {
    Name = "${var.name_prefix}-assets"
  }
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_ownership_controls" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    id     = "cleanup-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}

resource "aws_sqs_queue" "events_queue" {
  name                      = "${var.name_prefix}-events-queue"
  delay_seconds             = 0
  max_message_size          = 262144
  message_retention_seconds = 345600 # 4 days
  visibility_timeout_seconds = 30
  receive_wait_time_seconds = 0
  fifo_queue                = false

  tags = {
    Name = "${var.name_prefix}-events-queue"
  }
}

resource "aws_sqs_queue_policy" "events_queue" {
  queue_url = aws_sqs_queue.events_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { AWS = data.aws_caller_identity.current.account_id }
        Action    = "sqs:*"
        Resource  = aws_sqs_queue.events_queue.arn
      }
    ]
  })
}

resource "aws_sns_topic" "notifications" {
  name = "${var.name_prefix}-notifications"

  tags = {
    Name = "${var.name_prefix}-notifications"
  }
}

resource "aws_sns_topic_subscription" "notifications_to_sqs" {
  topic_arn = aws_sns_topic.notifications.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.events_queue.arn
}

resource "aws_sqs_queue_policy" "allow_sns" {
  queue_url = aws_sqs_queue.events_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "sns.amazonaws.com" }
        Action    = "sqs:SendMessage"
        Resource  = aws_sqs_queue.events_queue.arn
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = aws_sns_topic.notifications.arn
          }
        }
      }
    ]
  })
}

data "aws_caller_identity" "current" {}