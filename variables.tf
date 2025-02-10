variable "ami_id" {
  description = "The AMI ID for the EC2 instance"
  type = string
}

variable "subnet_id" {
  description = "The Subnet ID where the EC2 instance will be launched"
  type        = string
}

variable "security_group_ids" {
  description = "The Security Group IDs for the EC2 instance"
  type        = list(string)
}
