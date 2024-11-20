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

variable "db_name" {
  description = "The name of the database"
  type = string
}

variable "db_pass" {
    description = "The password of the database"
    type = string
}


variable node_env {
    description = "The environment of the node process"
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
