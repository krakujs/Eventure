provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "Eventure"
      Owner       = "DevOps"
      Terraform   = "true"
    }
  }
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "Eventure"
      Owner       = "DevOps"
      Terraform   = "true"
    }
  }
}