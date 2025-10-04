# Mojo

A Venmo clone for peer-to-peer payments.

## Development

This project uses Nix for development environment management.

```bash
# Enter development environment
nix develop

# Run development server
nix run .#dev
```

## Architecture

- **Backend**: Flask API
- **DevOps**: Ansible + Terraform for deployment
- **Environment**: Nix flakes for reproducible development
