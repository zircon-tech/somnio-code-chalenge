## AppRunner Service role
resource "aws_iam_role" "apprunner-service-role" {
  name               = "${var.apprunner_service_role}-AppRunnerECRAccessRole${var.identifier}"
  path               = "/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "apprunner-service-role-attachment" {
  role       = "${aws_iam_role.apprunner-service-role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

## AppRunner Instance role
resource "aws_iam_role" "apprunner-instance-role" {
  name = "${var.apprunner_service_role}AppRunnerInstanceRole${var.identifier}"
  path = "/"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "tasks.apprunner.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "apprunner-service-role-elasticache-attachment" {
  role       = aws_iam_role.apprunner-instance-role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonElastiCacheFullAccess"
}

# data "aws_ssm_parameter" "magic_secret_key" {
# #  name = "/database/password"
#   name = var.ssm_parameter_store_name
# }

# resource "aws_iam_policy" "apprunner-policy" {
#   name = "apprunner-getSSM"
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Action = "sts:GetParameter"
#         Effect = "Allow"
#         Resources = ["arn:aws:ssm:*:${data.aws_caller_identity.current.account_id}:parameter${data.aws_ssm_parameter.magic_secret_key.name}"]
#       },
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "apprunner-instance-role-attachment" {
#   role = aws_iam_role.apprunner-instance-role.name
#   policy_arn = aws_iam_policy.apprunner-policy.arn
# }


# AppRunner Auto Scaling Configuration
resource "aws_apprunner_auto_scaling_configuration_version" "auto-scaling-config" {
  auto_scaling_configuration_name = "${var.application_name}-${var.environment}-config"
  max_concurrency                 = var.apprunner_max_concurrency
  max_size                        = var.app_runner_max_size
  min_size                        = var.app_runner_min_size

  tags = {
    Name = "apprunner-auto-scaling-somnio-v2-api-config"
  }
}

# resource "aws_kms_key" "aws_kms_key_id_sui" {
#   description             = "KMS key for SUI"
#   deletion_window_in_days = 10
#   key_usage               = "SIGN_VERIFY"
#   customer_master_key_spec = "ECC_SECG_P256K1"
# }

# resource "aws_iam_policy" "apprunner_kms_access" {
#   name        = "AppRunnerKMSAccess"
#   description = "Allow AppRunner service to access KMS"

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect = "Allow",
#         Action = [
#           "kms:Sign",
#           "kms:Verify"
#         ],
#         Resource = var.aws_kms_key_id_sui
#       }
#     ]
#   })
# }

# resource "aws_iam_role_policy_attachment" "apprunner_kms_access_attachment" {
#   role       = aws_iam_role.apprunner-service-role.name
#   policy_arn = aws_iam_policy.apprunner_kms_access.arn
# }

# AppRunner Service
resource "aws_apprunner_service" "service" {
  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.auto-scaling-config.arn
  service_name                   = "${var.application_name}-${var.environment}-service"

  source_configuration {

    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner-service-role.arn
    }

    image_repository {
      image_configuration {
        port = var.app_runner_container_port

        runtime_environment_variables = {
          "AWS_REGION" : "${var.aws_region}",
          "DB_NAME": "${var.db_name}",
          "DB_PASS": "${var.db_pass}",
          "NODE_ENV": "${var.node_env}"
          "API_PORT": 8000,
          "STAGE": "${var.stage}",
        }
      }
      image_identifier      = "${var.aws_ecr_repository_url}:${var.ecr_image_tag}"
      image_repository_type = "ECR"
    }

    auto_deployments_enabled = true
  }

  instance_configuration {
    instance_role_arn = aws_iam_role.apprunner-instance-role.arn

    cpu    = "${var.apprunner_cpu}"
    memory = "${var.apprunner_memory}"
  }

  network_configuration {
    ingress_configuration {
      is_publicly_accessible = true
    }
  }

  tags = var.app_tags
}

output "apprunner_service_url" {
  value = "https://${aws_apprunner_service.service.service_url}"
}