terraform {
  cloud {
    organization = "zircontech"

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

module "s3" {
    source                  = "./s3"
    application_name        = var.application_name
    environment             = var.environment
    app_tags                = var.app_tags
}

module "elasticache" {
    source                  = "./elasticache"
    application_name        = var.application_name
    environment             = var.environment
    app_tags                = var.app_tags
    vpc_id                  = module.vpc.id
    cidr                    = var.cidr
    subnet_ids              = module.vpc.vpc_private_subnets
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
    aws_region                      = var.aws_region
    app_tags                        = var.app_tags
    aws_ecr_repository_url          = module.aws_ecr.aws_ecr_repository_url
    database_url                    = var.database_url
    db_name                         = var.db_name
    db_pass                         = var.db_pass
    magic_secret_key                = var.magic_secret_key
    node_env                        = var.node_env
    admin_api_key                   = var.admin_api_key
    twitter_api_consumer_key        = var.twitter_api_consumer_key
    twitter_api_consumer_secret     = var.twitter_api_consumer_secret
    app_base_url                    = var.app_base_url
    redis_host                      = var.redis_host
    sentry_dsn                      = var.sentry_dsn
    instagram_client_id             = var.instagram_client_id
    instagram_client_secret         = var.instagram_client_secret
    stage                           = var.stage
    ecr_image_tag                   = var.ecr_image_tag
    identifier                      = var.identifier
    segment_write_key               = var.segment_write_key
    stripe_webhook_secret           = var.stripe_webhook_secret
    sendbird_application_id         = var.sendbird_application_id
    sendbird_master_api_token       = var.sendbird_master_api_token
    stripe_secret_key               = var.stripe_secret_key
    aws_kms_key_id_sui              = var.aws_kms_key_id
    sui_enabled                     = var.sui_enabled
    sui_network                     = var.sui_network
    sui_package_id                  = var.sui_package_id
    sui_publisher                   = var.sui_publisher
    stripe_webhook_connect_secret   = var.stripe_webhook_connect_secret
    aws_ses_secret_key              = var.aws_ses_secret_key
    s3_upload_secret                = var.s3_upload_secret
}

# # Other necessary services
# # Add other services/resources as needed
