module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 4.0"

  name        = "${var.application_name}-${var.environment}-db-sg"
  description = "PostgreSQL security group"
  vpc_id      = var.vpc_id

  # inbound rules
  ingress_with_cidr_blocks = [
    {
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      description = "PostgreSQL access"
      cidr_blocks = "0.0.0.0/0"
    },
  ]

  # outbound rules
  egress_with_cidr_blocks = [
    {
      rule        = "postgresql-tcp"
      cidr_blocks = "0.0.0.0/0"
    },
  ]

  tags = var.app_tags
}

module "db" {
  source  = "terraform-aws-modules/rds/aws"

  identifier = "${var.application_name}${var.environment}db"

  engine            = "postgres"
  engine_version    = "16.1"
  instance_class    = var.postgres_instance_class
  allocated_storage = 20

  db_name                = "${var.application_name}${var.environment}"
  username               = "postgres"
  password               = "${var.postgres_password}"
  port                   = 5432

  publicly_accessible  = true

  # DB subnet group
  create_db_subnet_group = true
  subnet_ids             = var.db_subnets
  multi_az               = var.db_multi_az
  vpc_security_group_ids = [module.security_group.security_group_id]

  maintenance_window = "Mon:00:00-Mon:03:00"
  backup_window      = "03:00-06:00"

  # Enhanced Monitoring - see example for details on how to create the role
  # by yourself, in case you don't want to create it automatically
  monitoring_interval       = "30"
  monitoring_role_name      = var.rds_monitoring_role_name
  create_monitoring_role    = true

  tags = var.app_tags

  # DB parameter group
  family = "postgres16"

  # DB option group
  major_engine_version = "16"

  # Database Deletion Protection
  deletion_protection = false

  parameters = [
    {
      name  = "autovacuum"
      value = 1
    },
    {
      name  = "client_encoding"
      value = "utf8"
    },
    {
      name  = "rds.force_ssl"
      value = "0"
    },
    {
      name = "password_encryption"
      value = "md5"
    },
  ]
}
