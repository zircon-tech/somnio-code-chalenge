variable "aws_region" {
  type = string
  description = "AWS region to launch servers."
  default = "us-east-1"
}

variable "aws_access_key" {
  type = string
  description = "AWS access key."
}

variable "aws_secret_key" {
  type = string
  description = "AWS secret key."
}

variable "application_name" {
  description = "the name of the application"
  type = string
}

variable "environment" {
  description = "the name of your environment, e.g. \"prod\""
  type = string
}

variable app_tags {
  description = "A map of tags to add to all resources"
  type = map(string)
}

variable "cidr" {
  description = "The CIDR block for the VPC."
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "a comma-separated list of availability zones, if set to something other than the defaults, both private_subnets and public_subnets have to be defined as well"
  default     = ["us-east-1a", "us-east-1b"]
}

variable "private_subnets" {
  description = "a list of CIDRs for private subnets in your VPC, must be set if the cidr variable is defined, needs to have as many elements as there are availability zones"
  default     = ["10.0.0.0/20", "10.0.32.0/20"]
}

variable "public_subnets" {
  description = "a list of CIDRs for public subnets in your VPC, must be set if the cidr variable is defined, needs to have as many elements as there are availability zones"
  default     = ["10.0.16.0/20", "10.0.48.0/20"]
}

variable "postgres_password" {
    description = "The password for the database. Pick something secure!"
    type = string
}

variable "postgres_instance_class" {
    description = "The instance class for the database, e.g. db.t2.micro"
    type = string
}

variable "db_multi_az" {
    description = "Whether to use multi-AZ for the database"
    type = bool
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

variable app_base_url {
    description = "The base url of the application"
    type = string
}

variable "stage" {
    description = "The stage of the application"
    type = string
}

variable "ecr_image_tag" {
    description = "The tag of the image in the ECR repository"
    type = string
}

variable "rds_monitoring_role_name" {
    description = "The name of the role to create for enhanced monitoring"
    type = string
    default = "MyRDSMonitoringRole"
}

variable "identifier" {
    description = "The identifier of the image"
    type = string
    default = ""
}
