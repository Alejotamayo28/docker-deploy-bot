resource "aws_instance" "mi_ec2" {
  ami           = var.ami_id
  instance_type = "t2.micro"
  key_name      = "demo-keypair-ssh"

  subnet_id              = var.subnet_id
  vpc_security_group_ids = var.security_group_ids

  tags = {
    Name = "MiServidorEC2"
  }
}

output "public_ip" {
  description = "La IP pública de la instancia EC2"
  value       = aws_instance.mi_ec2.public_ip
}

output "connect_command" {
  description = "Comando para conectar a la instancia EC2"
  value       = "ssh -i \"demo-keypair-ssh.pem\" ubuntu@${aws_instance.mi_ec2.public_ip}"
}

