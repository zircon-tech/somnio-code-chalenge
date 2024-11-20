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

variable "db_subnets" {
    description = "the private subnets for your environment, e.g. \"subnet-12345678,subnet-87654321\""
}

variable "vpc_id" {
    type = string
}

variable "cidr" {
    description = "The CIDR block for the VPC."
}

variable "postgres_instance_class" {
    description = "The instance class for the database, e.g. db.t2.micro"
    type = string
}

variable "postgres_password" {
    description = "The password for the database. Pick something secure!"
    type = string
}

variable "db_multi_az" {
    description = "Whether to use multi-AZ for the database"
    type = bool
}

variable "rds_monitoring_role_name" {
    description = "The name of the role to create for enhanced monitoring"
    type = string
    default = "MyRDSMonitoringRole"
}
