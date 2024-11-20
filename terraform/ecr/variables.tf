variable "environment" {
    description = "The environment to deploy the application to"
    type        = string
}

variable "identifier" {
    description = "The identifier of the image"
    type = string
    default = ""
}