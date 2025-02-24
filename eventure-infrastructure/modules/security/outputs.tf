output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb.id
}

output "frontend_security_group_id" {
  description = "ID of the frontend security group"
  value       = aws_security_group.frontend.id
}

output "backend_security_group_id" {
  description = "ID of the backend security group"
  value       = aws_security_group.backend.id
}

output "websocket_security_group_id" {
  description = "ID of the WebSocket security group"
  value       = aws_security_group.websocket.id
}

output "documentdb_security_group_id" {
  description = "ID of the DocumentDB security group"
  value       = aws_security_group.documentdb.id
}

output "elasticache_security_group_id" {
  description = "ID of the ElastiCache security group"
  value       = aws_security_group.elasticache.id
}

output "lambda_security_group_id" {
  description = "ID of the Lambda security group"
  value       = aws_security_group.lambda.id
}

output "certificate_arn" {
  description = "ARN of the regional ACM certificate"
  value       = aws_acm_certificate.regional.arn
}

output "cloudfront_certificate_arn" {
  description = "ARN of the global ACM certificate for CloudFront"
  value       = aws_acm_certificate.main.arn
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = var.enable_cognito ? aws_cognito_user_pool.main[0].id : null
}

output "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = var.enable_cognito ? aws_cognito_user_pool_client.main[0].id : null
}

output "cognito_user_pool_domain" {
  description = "Domain name of the Cognito User Pool"
  value       = var.enable_cognito ? aws_cognito_user_pool_domain.main[0].domain : null
}

output "waf_web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  value       = var.enable_waf ? aws_wafv2_web_acl.main[0].arn : null
}

output "cloudfront_waf_web_acl_arn" {
  description = "ARN of the CloudFront WAF Web ACL"
  value       = var.enable_waf ? aws_wafv2_web_acl.cloudfront[0].arn : null
}