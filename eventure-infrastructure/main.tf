locals {
  name_prefix = "${var.app_name}-${var.environment}"
}

module "networking" {
  source = "./modules/networking"

  vpc_cidr            = var.vpc_cidr
  availability_zones  = var.availability_zones
  public_subnet_cidrs = var.public_subnet_cidrs
  app_subnet_cidrs    = var.app_subnet_cidrs
  data_subnet_cidrs   = var.data_subnet_cidrs
  environment         = var.environment
  name_prefix         = local.name_prefix
}

module "security" {
  source = "./modules/security"

  vpc_id              = module.networking.vpc_id
  environment         = var.environment
  name_prefix         = local.name_prefix
  enable_waf          = var.enable_waf
  app_subnet_cidrs    = var.app_subnet_cidrs
  data_subnet_cidrs   = var.data_subnet_cidrs
  public_subnet_cidrs = var.public_subnet_cidrs
}

module "frontend" {
  source = "./modules/frontend"

  name_prefix                = local.name_prefix
  environment                = var.environment
  vpc_id                     = module.networking.vpc_id
  public_subnets             = module.networking.public_subnet_ids
  app_subnets                = module.networking.app_subnet_ids
  frontend_security_group_id = module.security.frontend_security_group_id
  alb_security_group_id      = module.security.alb_security_group_id
  container_image            = var.frontend_container_image
  container_port             = var.frontend_container_port
  desired_count              = var.frontend_desired_count
  domain_name                = var.domain_name
  route53_zone_id            = module.networking.route53_zone_id
  cognito_user_pool_id       = module.security.cognito_user_pool_id
  cognito_user_pool_client_id = module.security.cognito_user_pool_client_id
  waf_web_acl_arn            = module.security.waf_web_acl_arn
  certificate_arn            = module.security.certificate_arn
  enable_ssl                 = var.enable_ssl

  depends_on = [
    module.networking,
    module.security
  ]
}

module "backend" {
  source = "./modules/backend"

  name_prefix               = local.name_prefix
  environment               = var.environment
  vpc_id                    = module.networking.vpc_id
  public_subnets            = module.networking.public_subnet_ids
  app_subnets               = module.networking.app_subnet_ids
  backend_security_group_id = module.security.backend_security_group_id
  alb_security_group_id     = module.security.alb_security_group_id
  container_image           = var.backend_container_image
  container_port            = var.backend_container_port
  desired_count             = var.backend_desired_count
  domain_name               = "api.${var.domain_name}"
  route53_zone_id           = module.networking.route53_zone_id
  waf_web_acl_arn           = module.security.waf_web_acl_arn
  certificate_arn           = module.security.certificate_arn
  enable_ssl                = var.enable_ssl

  depends_on = [
    module.networking,
    module.security
  ]
}

module "websocket" {
  source = "./modules/websocket"

  name_prefix                  = local.name_prefix
  environment                  = var.environment
  vpc_id                       = module.networking.vpc_id
  public_subnets               = module.networking.public_subnet_ids
  app_subnets                  = module.networking.app_subnet_ids
  websocket_security_group_id  = module.security.websocket_security_group_id
  alb_security_group_id        = module.security.alb_security_group_id
  container_image              = var.websocket_container_image
  container_port               = var.websocket_container_port
  desired_count                = var.websocket_desired_count
  domain_name                  = "ws.${var.domain_name}"
  route53_zone_id              = module.networking.route53_zone_id
  certificate_arn              = module.security.certificate_arn
  enable_ssl                   = var.enable_ssl

  depends_on = [
    module.networking,
    module.security
  ]
}

module "data" {
  source = "./modules/data"

  name_prefix                = local.name_prefix
  environment                = var.environment
  vpc_id                     = module.networking.vpc_id
  data_subnets               = module.networking.data_subnet_ids
  documentdb_security_group_id = module.security.documentdb_security_group_id
  elasticache_security_group_id = module.security.elasticache_security_group_id
  documentdb_instance_class  = var.documentdb_instance_class
  documentdb_instance_count  = var.documentdb_instance_count
  elasticache_node_type      = var.elasticache_node_type
  elasticache_node_count     = var.elasticache_node_count
  backup_retention_days      = var.backup_retention_days

  depends_on = [
    module.networking,
    module.security
  ]
}

module "lambda" {
  source = "./modules/lambda"

  name_prefix     = local.name_prefix
  environment     = var.environment
  vpc_id          = module.networking.vpc_id
  app_subnets     = module.networking.app_subnet_ids
  lambda_security_group_id = module.security.lambda_security_group_id
  documentdb_endpoint = module.data.documentdb_endpoint
  documentdb_port     = module.data.documentdb_port
  elasticache_endpoint = module.data.elasticache_endpoint
  elasticache_port     = module.data.elasticache_port
  dynamodb_table_name = module.data.dynamodb_table_name

  depends_on = [
    module.networking,
    module.security,
    module.data
  ]
}

module "monitoring" {
  source = "./modules/monitoring"

  name_prefix     = local.name_prefix
  environment     = var.environment
  alarm_email     = var.alarm_email
  frontend_ecs_cluster_name = module.frontend.ecs_cluster_name
  frontend_ecs_service_name = module.frontend.ecs_service_name
  backend_ecs_cluster_name  = module.backend.ecs_cluster_name
  backend_ecs_service_name  = module.backend.ecs_service_name
  websocket_ecs_cluster_name = module.websocket.ecs_cluster_name
  websocket_ecs_service_name = module.websocket.ecs_service_name
  frontend_alb_arn          = module.frontend.alb_arn
  backend_alb_arn           = module.backend.alb_arn
  websocket_alb_arn         = module.websocket.alb_arn
  documentdb_cluster_identifier = module.data.documentdb_cluster_identifier
  elasticache_cluster_id    = module.data.elasticache_cluster_id
  lambda_functions          = module.lambda.lambda_functions

  depends_on = [
    module.frontend,
    module.backend,
    module.websocket,
    module.data,
    module.lambda
  ]
}

module "cicd" {
  source = "./modules/cicd"

  name_prefix     = local.name_prefix
  environment     = var.environment
  frontend_ecr_repository_url = "123456789012.dkr.ecr.eu-west-3.amazonaws.com/eventure/frontend"
  backend_ecr_repository_url  = "123456789012.dkr.ecr.eu-west-3.amazonaws.com/eventure/backend"
  websocket_ecr_repository_url = "123456789012.dkr.ecr.eu-west-3.amazonaws.com/eventure/websocket"
  frontend_ecs_cluster_name = module.frontend.ecs_cluster_name
  frontend_ecs_service_name = module.frontend.ecs_service_name
  backend_ecs_cluster_name  = module.backend.ecs_cluster_name
  backend_ecs_service_name  = module.backend.ecs_service_name
  websocket_ecs_cluster_name = module.websocket.ecs_cluster_name
  websocket_ecs_service_name = module.websocket.ecs_service_name
  frontend_task_definition_arn = module.frontend.task_definition_arn
  backend_task_definition_arn = module.backend.task_definition_arn
  websocket_task_definition_arn = module.websocket.task_definition_arn

  depends_on = [
    module.frontend,
    module.backend,
    module.websocket
  ]
}