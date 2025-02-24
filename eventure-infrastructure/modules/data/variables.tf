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

variable "data_subnets" {
  description = "List of private data subnet IDs"
  type        = list(string)
}

variable "documentdb_security_group_id" {
  description = "ID of the DocumentDB security group"
  type        = string
}

variable "elasticache_security_group_id" {
  description = "ID of the ElastiCache security group"
  type        = string
}

variable "documentdb_instance_class" {
  description = "Instance class for DocumentDB"
  type        = string
  default     = "db.t3.medium"
}

variable "documentdb_instance_count" {
  description = "Number of DocumentDB instances"
  type        = number
  default     = 1
}

variable "elasticache_node_type" {
  description = "Node type for ElastiCache Redis"
  type        = string
  default     = "cache.t3.small"
}

variable "elasticache_node_count" {
  description = "Number of ElastiCache Redis nodes"
  type        = number
  default     = 1
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
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