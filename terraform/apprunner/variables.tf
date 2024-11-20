variable "aws_region" {
  type = string
  description = "AWS region to launch servers."
  default = "us-east-1"
}

variable "application_name" {
  description = "the name of the application"
  type = string
  default = "somnio-api"
}

variable "environment" {
  description = "the name of your environment, e.g. \"prod\""
  type = string
  default = "dev"
}

variable "apprunner_service_role" {
  description = "This role gives App Runner permission to access ECR"
  default     = "somnio-api"
}

variable "app_runner_container_port" {
  description = "Port exposed by the docker image to redirect traffic to"
  default     = 8000
}

variable "apprunner_max_concurrency" {
  description = "AppRunner Instance MAX Concurrency"
  default     = 100
}

variable "app_runner_max_size" {
  description = "AppRunner Instance MAX Size"
  default     = "10"
}

variable "app_runner_min_size" {
  description = "AppRunner Instance MIN Size"
  default     = "2"
}

variable "apprunner_cpu" {
  description = "AppRunner Instance CPU"
  default     = "1 vCPU"
}

variable "apprunner_memory" {
  description = "AppRunner Instance Memory"
  default     = "2 GB"
}

variable "aws_ecr_repository_url" {
  description = "ECR Repository URL"
  type = string
}

variable app_tags {
  description = "A map of tags to add to all resources"
  type = map(string)
}

variable database_url {
  description = "Database URL"
  type = string
}

variable "db_name" {
  description = "The name of the database"
  type = string
}

variable "db_pass" {
    description = "The password of the database"
    type = string
}

variable "magic_secret_key" {
    description = "The secret key for the application"
    type = string
}

variable node_env {
    description = "The environment of the node process"
    type = string
}

variable admin_api_key {
    description = "The admin api key"
    type = string
}

variable twitter_api_consumer_key {
    description = "The twitter api consumer key"
    type = string
}

variable twitter_api_consumer_secret {
    description = "The twitter api consumer secret"
    type = string
}

variable app_base_url {
    description = "The base url of the application"
    type = string
}

variable redis_host {
    description = "The host of the redis server"
    type = string
}

variable sentry_dsn {
    description = "The sentry dsn"
    type = string
}

variable instagram_client_id {
    description = "The instagram client id"
    type = string
}

variable instagram_client_secret {
    description = "The instagram client secret"
    type = string
}

variable "stage" {
    description = "The stage of the application"
    type = string
}

variable "ecr_image_tag" {
    description = "The image tag name"
    type = string
}

variable "identifier" {
    description = "The identifier of the image"
    type = string
    default = ""
}

variable segment_write_key {
    description = "The segment write key"
    type = string
}

variable "stripe_webhook_secret" {
    description = "The stripe webhook secret"
    type = string
}

variable "sendbird_application_id" {
    description = "The sendbird application id"
    type = string
}

variable "sendbird_master_api_token" {
    description = "The sendbird master api token"
    type = string
}

variable "sui_enabled" {
    description = "Whether or not SUI-related features are enabled"
    type = bool
    default = false
}

variable "sui_network" {
  description = "Network to use for SUI-related features"
  type = string
  
  # validation {
  #   condition     = var.sui_enabled == false || (var.sui_enabled == true && contains(["testnet", "devnet", "mainnet"], var.sui_network))
  #   error_message = "Valid values for var: sui_network are (testnet, devnet, mainnet)."
  # }
  
  # validation {
  #   condition     = var.sui_enabled == false || (var.sui_enabled == true && length(var.sui_network) > 0)
  #   error_message = "sui_network must be provided when sui_enabled is true."
  # }
}

variable "sui_package_id" {
  description = "Package ID to use for SUI-related features"
  type = string

  # validation {
  #   condition = var.sui_enabled == false || (var.sui_enabled == true && length(var.sui_package_id) > 0)
  #   error_message = "sui_package_id must be provided when sui_enabled is true."
  # }
}

variable "sui_publisher" {
  description = "Publisher to use for SUI-related features"
  type = string

  # validation {
  #   condition = var.sui_enabled == false || (var.sui_enabled == true && length(var.sui_publisher) > 0)
  #   error_message = "sui_publisher must be provided when sui_enabled is true."
  # }
}

variable "aws_kms_key_id_sui" {
  description = "KMS Key ID to use for the SUI master wallet"
  type = string

  # validation {
  #   condition = var.sui_enabled == false || (var.sui_enabled == true && length(var.aws_kms_key_id) > 0)
  #   error_message = "aws_kms_key_id must be provided when sui_enabled is true."
  # }
}

variable "stripe_secret_key" {
    description = "The stripe secret key"
    type = string
}

variable "stripe_webhook_connect_secret" {
    description = "The stripe webhook connect secret"
    type = string
}

variable "aws_ses_secret_key" {
    description = "The AWS SES secret key"
    type = string
}

variable "s3_upload_secret" {
    description = "The S3 upload secret"
    type = string
}