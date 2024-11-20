# Terraform Architecture

This terraform setup can be used to setup an AppRunner based stack on AWS infrastructure running a Docker application. It also creates an RDS instance for the application to use. The setup is designed to be used with a secrets file, so that you can keep your secrets out of the repository.

## Resources

This setup creates the following resources:

- An ECR repository
- An RDS instance
- A VPC
- A security group
- A set of private and public subnets
- An IAM role for the AppRunner service
- An IAM policy for the AppRunner service
- An IAM policy for the RDS instance
- An IAM policy for the S3 bucket
- An AppRunner service and its environment variables

## Usage for Infrastructure Setup and Modifications

To operate with the Terraform setup you need to have the AWS CLI installed and configured on your machine. You can download the AWS CLI from the [AWS website](https://aws.amazon.com/cli/). In addition, install Terraform CLI from the [Terraform website](https://www.terraform.io/downloads.html). Make sure to install at least version `1.8.0`. Then you can follow the instructions below:

1. Create your own `secrets.tfvars` based on `secrets.example.tfvars` and ask your team administrator for the value on these files. These files contain sensitive information and should not be committed to the repository.

2. In order to be in sync with the Terraform infrastructure (your local state vs AWS state) you'll also have to download the state file from the Terraform Cloud. You can do this by running `terraform login` and then `terraform init`. This will download the latest state ran from the Terraform Cloud and store it locally. 

Bear in mind that Terraform only supports a single Workspace set at a time from the CLI so if you want to make changes on an environment different than `dev` you will need to switch between them in the `main.tf` file under workspaces (variables are not allowed) as follows:

```hcl
terraform {
  cloud {
    organization = "zircontech"

    workspaces {
        name = "dev" ==>> change this to the desired workspace (e.g "uat" or "prod")
    }
  }
}
```

Make sure to avoid committing this change to the repository.

3. Execute the following command which  will calculate the changes terraform has to apply and creates a plan. If there are changes, you will see them. Check if any of the changes are expected, especially deletion of infrastructure.

```bash
terraform plan -var-file="secrets.tfvars" -var-file="environment.tfvars" -out="out.plan"
```

4. If everything looks good, you can execute the changes using 

```bash
terraform apply out.plan`
```

## Change variables only, using Terraform Cloud

In addition to the local setup, for the sake of simplification you may use Terraform Cloud if you only need to add/update some environment variables. This means that the state file is stored in Terraform Cloud and not in the repository.

To use Terraform Cloud, you need to have an account and be invited to the organization that is managing the infrastructure. Start by logging into Terraform Cloud. 

- Next, go to the desired workspace -> Variables -> Workspace Variables and add/update the desired variables.
- Then go to the desired workspace -> Run -> Queue Plan and Apply. This will apply the changes to the infrastructure.


## Complementary Resources

In addition to the resources created by this terraform setup, you will need to create the following resources manually:

- AWS Code Build pipelines
- In case you want to setup a Frontend application: the AWS Amplify configuration and AWS WAF configuration with its Cloudfront distribution
