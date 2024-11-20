terraform {
  cloud {
    organization = "propia"

    workspaces {
        name = "dev"
    }
  }
}

provider "aws" {
    access_key = var.aws_access_key
    secret_key = var.aws_secret_key
    region     = var.aws_region
}

module "aws_ecr" {
    source              = "./ecr"
    environment         = var.environment
    identifier          = var.identifier
}

## At this point you might want to configure a CodeBuild project to build and push the Docker image to ECR
## That way, you can use the image in the AppRunner service

module "vpc" {
    source             = "./vpc"
    application_name   = var.application_name
    region             = var.aws_region
    cidr               = var.cidr
    private_subnets    = var.private_subnets
    public_subnets     = var.public_subnets
    availability_zones = var.availability_zones
    environment        = var.environment
}

module "rds" {
    source                      = "./rds"
    application_name            = var.application_name
    environment                 = var.environment
    app_tags                    = var.app_tags
    db_subnets                  = module.vpc.vpc_public_subnets
    vpc_id                      = module.vpc.id
    cidr                        = var.cidr
    postgres_instance_class     = var.postgres_instance_class
    postgres_password           = var.postgres_password
    db_multi_az                 = var.db_multi_az
    rds_monitoring_role_name    = var.rds_monitoring_role_name
}

# module "kms" {
#     source = "terraform-aws-modules/kms/aws"

#     is_enabled              = true
#     multi_region            = false
#     enable_key_rotation     = false
#     deletion_window_in_days = 7
# }

# resource "aws_kms_key" "aws_kms_key_id_sui" {
#   description             = "KMS key for SUI"
#   deletion_window_in_days = 10
#   key_usage               = "SIGN_VERIFY"
#   customer_master_key_spec = "ECC_SECG_P256K1"
# }

module "aws_apprunner" {
    source                          = "./apprunner"
    application_name                = var.application_name
    environment                     = var.environment
    app_tags                        = var.app_tags
    aws_ecr_repository_url          = module.aws_ecr.aws_ecr_repository_url
    db_name                         = var.db_name
    db_pass                         = var.db_pass
    node_env                        = var.node_env
    stage                           = var.stage
    ecr_image_tag                   = var.ecr_image_tag
    identifier                      = var.identifier
}

# # Other necessary services
# # Add other services/resources as needed
