# Linode Provider definition
terraform {
  required_providers {
    linode = {
      source  = "linode/linode"
      version = "3.0.0"
    }
  }
}

provider "linode" {
  token = var.token
}

# Example Web Server
resource "linode_instance" "server" {
  image           = "linode/ubuntu22.04"
  label           = "server"
  region          = var.region
  type            = "g6-standard-1"
  swap_size       = 1024
  authorized_keys = [var.authorized_keys]
  root_pass       = var.root_pass
}

resource "local_file" "ansible_inventory" {
  content  = templatefile("../ansible/inventory.tmpl", {
    web_server_ips = [linode_instance.server.ip_address] # or a list if multiple instances
  })
  filename = "../ansible/inventory.ini"
}

