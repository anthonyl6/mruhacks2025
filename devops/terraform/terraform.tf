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

# Firewall
resource "linode_firewall" "firewall" {
  label = "firewall"

  inbound {
    label    = "allow-https"
    action   = "ACCEPT"
    protocol = "TCP"
    ports    = "443"
    ipv4     = ["0.0.0.0/0"]
    ipv6     = ["::/0"]
  }

  inbound {
    label    = "allow-ssh"
    action   = "ACCEPT"
    protocol = "TCP"
    ports    = "22"
    ipv4     = ["0.0.0.0/0"]
    ipv6     = ["::/0"]
  }

  inbound {
    label    = "allow-api"
    action   = "ACCEPT"
    protocol = "TCP"
    ports    = "5000"
    ipv4     = ["0.0.0.0/0"]
    ipv6     = ["::/0"]
  }

  inbound_policy = "DROP"

  outbound_policy = "ACCEPT"

  linodes = [linode_instance.server.id]
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
  content = templatefile("../ansible/inventory.tmpl", {
    web_server_ips = [linode_instance.server.ip_address] # or a list if multiple instances
  })
  filename = "../ansible/inventory.ini"
}

