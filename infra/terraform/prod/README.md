# Art App Terraform

This folder is the new app-scoped Terraform root for deploying the Art App to Azure Static Web Apps.

It intentionally reuses only a few safe ideas from the older shared Terraform stack:

- provider version pinning
- remote Azure backend pattern
- simple environment and region based naming
- consistent tags

It does not reuse the older shared platform state, ARO resources, SQL, network, firewall, or identity resources.

## Files

- `providers.tf`: Terraform version, backend block, and provider configuration
- `variables.tf`: input variables for the app stack
- `main.tf`: resource group and Static Web App
- `outputs.tf`: useful deployment outputs
- `terraform.tfvars.example`: starter variable values
- `backend.hcl.example`: isolated backend configuration for this app

## First Run

1. Copy `terraform.tfvars.example` to `terraform.tfvars`
2. Update values for your subscription and naming
3. Copy `backend.hcl.example` to `backend.hcl`
4. Point `backend.hcl` to the storage account and container that will hold this app's Terraform state
5. Run:

```bash
terraform init -backend-config=backend.hcl
terraform plan
terraform apply
```

## Notes

- The `key` in `backend.hcl` is already app-specific so this state stays separate from the older shared Terraform root.
- The Static Web App resource is created without GitHub linkage. You can connect CI/CD after the resource exists.
