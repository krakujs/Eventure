aws_region          = "eu-west-3"
environment         = "dev"
vpc_cidr            = "10.0.0.0/16"
availability_zones  = ["eu-west-3a", "eu-west-3b"]
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
app_subnet_cidrs    = ["10.0.11.0/24", "10.0.12.0/24"]
data_subnet_cidrs   = ["10.0.21.0/24", "10.0.22.0/24"]
app_name            = "eventure"
domain_name         = "eventure-dev.example.com"

frontend_container_image  = "123456789012.dkr.ecr.eu-west-3.amazonaws.com/eventure/frontend:dev"
backend_container_image   = "123456789012.dkr.ecr.eu-west-3.amazonaws.com/eventure/backend:dev"
websocket_container_image = "123456789012.dkr.ecr.eu-west-3.amazonaws.com/eventure/websocket:dev"

frontend_desired_count  = 2
backend_desired_count   = 2
websocket_desired_count = 2

documentdb_instance_class = "db.t3.medium"
documentdb_instance_count = 1

elasticache_node_type  = "cache.t3.small"
elasticache_node_count = 1

enable_waf     = true
enable_ssl     = true
enable_cognito = true

backup_retention_days = 7
alarm_email           = "dev-alerts@eventure.example.com"