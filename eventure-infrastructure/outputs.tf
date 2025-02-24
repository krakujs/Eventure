output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "app_subnet_ids" {
  description = "List of private application subnet IDs"
  value       = module.networking.app_subnet_ids
}

output "data_subnet_ids" {
  description = "List of private data subnet IDs"
  value       = module.networking.data_subnet_ids
}

output "frontend_url" {
  description = "URL of the frontend application"
  value       = module.frontend.frontend_url
}

output "backend_url" {
  description = "URL of the backend API"
  value       = module.backend.backend_url
}

output "websocket_url" {
  description = "URL of the WebSocket service"
  value       = module.websocket.websocket_url
}

output "documentdb_endpoint" {
  description = "Endpoint of the DocumentDB cluster"
  value       = module.data.documentdb_endpoint
  sensitive   = true
}

output "elasticache_endpoint" {
  description = "Endpoint of the ElastiCache Redis cluster"
  value       = module.data.elasticache_endpoint
  sensitive   = true
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = module.security.cognito_user_pool_id
}

output "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = module.security.cognito_user_pool_client_id
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = module.frontend.cloudfront_distribution_id
}

output "frontend_alb_arn" {
  description = "ARN of the frontend Application Load Balancer"
  value       = module.frontend.alb_arn
}

output "backend_alb_arn" {
  description = "ARN of the backend Application Load Balancer"
  value       = module.backend.alb_arn
}

output "websocket_alb_arn" {
  description = "ARN of the WebSocket Application Load Balancer"
  value       = module.websocket.alb_arn
}

output "frontend_ecs_cluster_name" {
  description = "Name of the frontend ECS cluster"
  value       = module.frontend.ecs_cluster_name
}

output "backend_ecs_cluster_name" {
  description = "Name of the backend ECS cluster"
  value       = module.backend.ecs_cluster_name
}

output "websocket_ecs_cluster_name" {
  description = "Name of the WebSocket ECS cluster"
  value       = module.websocket.ecs_cluster_name
}

output "frontend_ecs_service_name" {
  description = "Name of the frontend ECS service"
  value       = module.frontend.ecs_service_name
}

output "backend_ecs_service_name" {
  description = "Name of the backend ECS service"
  value       = module.backend.ecs_service_name
}

output "websocket_ecs_service_name" {
  description = "Name of the WebSocket ECS service"
  value       = module.websocket.ecs_service_name
}

output "lambda_function_names" {
  description = "Names of the Lambda functions"
  value       = module.lambda.lambda_function_names
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  value       = module.data.dynamodb_table_name
}

output "sns_topic_arn" {
  description = "ARN of the SNS topic for notifications"
  value       = module.monitoring.sns_topic_arn
}

output "cloudwatch_dashboard_url" {
  description = "URL of the CloudWatch dashboard"
  value       = module.monitoring.cloudwatch_dashboard_url
}

output "cicd_pipeline_url" {
  description = "URL of the CI/CD pipeline"
  value       = module.cicd.pipeline_url
}