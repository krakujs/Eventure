variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "public_subnets" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "app_subnets" {
  description = "List of private application subnet IDs"
  type        = list(string)
}

variable "backend_security_group_id" {
  description = "ID of the backend security group"
  type        = string
}

variable "alb_security_group_id" {
  description = "ID of the ALB security group"
  type        = string
}

variable "container_image" {
  description = "Container image for backend"
  type        = string
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 8080
}

variable "desired_count" {
  description = "Desired count of backend containers"
  type        = number
  default     = 2
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

variable "route53_zone_id" {
  description = "ID of the Route53 hosted zone"
  type        = string
}

variable "waf_web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate"
  type        = string
}

variable "enable_ssl" {
  description = "Enable SSL/TLS for endpoints"
  type        = bool
  default     = true
}

variable "documentdb_endpoint" {
  description = "Endpoint of the DocumentDB cluster"
  type        = string
  default     = ""
}

variable "documentdb_port" {
  description = "Port of the DocumentDB cluster"
  type        = number
  default     = 27017
}

variable "documentdb_username" {
  description = "Username for DocumentDB"
  type        = string
  default     = "eventure"
  sensitive   = true
}

variable "documentdb_password" {
  description = "Password for DocumentDB"
  type        = string
  default     = "Change_me!"
  sensitive   = true
}

variable "elasticache_endpoint" {
  description = "Endpoint of the ElastiCache Redis cluster"
  type        = string
  default     = ""
}

variable "elasticache_port" {
  description = "Port of the ElastiCache Redis cluster"
  type        = number
  default     = 6379
}

variable "assets_bucket_arn" {
  description = "ARN of the S3 bucket for assets"
  type        = string
  default     = ""
}

variable "dynamodb_table_arns" {
  description = "ARNs of DynamoDB tables"
  type        = list(string)
  default     = []
}

variable "sqs_queue_arns" {
  description = "ARNs of SQS queues"
  type        = list(string)
  default     = []
}

variable "sns_topic_arns" {
  description = "ARNs of SNS topics"
  type        = list(string)
  default     = []
}