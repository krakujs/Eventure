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

variable "websocket_security_group_id" {
  description = "ID of the WebSocket security group"
  type        = string
}

variable "alb_security_group_id" {
  description = "ID of the ALB security group"
  type        = string
}

variable "container_image" {
  description = "Container image for WebSocket service"
  type        = string
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 5000
}

variable "desired_count" {
  description = "Desired count of WebSocket containers"
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

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table for WebSocket connections"
  type        = string
  default     = ""
}

variable "dynamodb_table_arn" {
  description = "ARN of the DynamoDB table for WebSocket connections"
  type        = string
  default     = ""
}