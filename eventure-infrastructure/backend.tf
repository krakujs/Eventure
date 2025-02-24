terraform {
  backend "s3" {
    bucket         = "eventure-terraform-state"
    key            = "eventure/terraform.tfstate"
    region         = "eu-west-3"
    dynamodb_table = "eventure-terraform-locks"
    encrypt        = true
  }
}