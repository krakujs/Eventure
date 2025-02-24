output "documentdb_endpoint" {
  description = "Endpoint of the DocumentDB cluster"
  value       = aws_docdb_cluster.main.endpoint
}

output "documentdb_port" {
  description = "Port of the DocumentDB cluster"
  value       = aws_docdb_cluster.main.port
}

output "documentdb_cluster_identifier" {
  description = "Identifier of the DocumentDB cluster"
  value       = aws_docdb_cluster.main.cluster_identifier
}

output "documentdb_cluster_arn" {
  description = "ARN of the DocumentDB cluster"
  value       = aws_docdb_cluster.main.arn
}

output "elasticache_endpoint" {
  description = "Endpoint of the ElastiCache Redis cluster"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "elasticache_port" {
  description = "Port of the ElastiCache Redis cluster"
  value       = aws_elasticache_replication_group.main.port
}

output "elasticache_cluster_id" {
  description = "ID of the ElastiCache cluster"
  value       = aws_elasticache_replication_group.main.id
}

output "dynamodb_table_name" {
  description = "Name of the WebSocket connections DynamoDB table"
  value       = aws_dynamodb_table.websocket_connections.name
}

output "dynamodb_table_arn" {
  description = "ARN of the WebSocket connections DynamoDB table"
  value       = aws_dynamodb_table.websocket_connections.arn
}

output "chat_rooms_table_name" {
  description = "Name of the chat rooms DynamoDB table"
  value       = aws_dynamodb_table.chat_rooms.name
}

output "chat_rooms_table_arn" {
  description = "ARN of the chat rooms DynamoDB table"
  value       = aws_dynamodb_table.chat_rooms.arn
}

output "assets_bucket_name" {
  description = "Name of the assets S3 bucket"
  value       = aws_s3_bucket.assets.bucket
}

output "assets_bucket_arn" {
  description = "ARN of the assets S3 bucket"
  value       = aws_s3_bucket.assets.arn
}

output "sqs_queue_url" {
  description = "URL of the SQS queue"
  value       = aws_sqs_queue.events_queue.url
}

output "sqs_queue_arn" {
  description = "ARN of the SQS queue"
  value       = aws_sqs_queue.events_queue.arn
}

output "sns_topic_arn" {
  description = "ARN of the SNS topic"
  value       = aws_sns_topic.notifications.arn
}