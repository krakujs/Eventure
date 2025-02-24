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

variable "frontend_security_group_id" {
  description = "ID of the frontend security group"
  type        = string
}

variable "alb_security_group_id" {
  description = "ID of the ALB security group"
  type        = string
}

variable "container_image" {
  description = "Container image for frontend"
  type        = string
}

variable "container_port" {
  description = "Port the container listens on"
  type        = number
  default     = 80
}

variable "desired_count" {
  description = "Desired count of frontend containers"
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

variable "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  type        = string
  default     = ""
}

variable "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  type        = string
  default     = ""
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