# Custom Domain Setup for Nonprod Static Web App

This document explains how to bind the apex custom domain `mmartga.com` from GoDaddy to the nonprod Azure Static Web App for this repository.

## Summary

The setup matches the Ankacore pattern:

- Azure Static Web Apps for hosting
- Terraform for Azure resource management
- GoDaddy for DNS
- Azure-managed TLS after the domain binding succeeds

## Current Nonprod Values

- Resource group: `n-weu-rg-01-a01`
- Static Web App name: `n-weu-art-swa-01-a01`
- Default hostname: `red-glacier-0d0fc8003.2.azurestaticapps.net`
- Custom domain to bind: `mmartga.com`

## Terraform Support Added

The nonprod Terraform now supports Azure Static Web App custom-domain binding.

### Providers

The stack now includes the `azapi` provider so Terraform can manage:

- `Microsoft.Web/staticSites/customDomains`

### Variables

The stack now supports these inputs:

- `custom_domain_name`
- `custom_domain_validation_method`
- `enable_custom_domain_binding`

Recommended nonprod values:

```hcl
custom_domain_name              = "mmartga.com"
custom_domain_validation_method = "dns-txt-token"
enable_custom_domain_binding    = false
```

Keep `enable_custom_domain_binding = false` until the Azure validation token and GoDaddy DNS records are in place.

### Resource Behavior

Terraform creates the Azure custom-domain binding only when both conditions are true:

```hcl
custom_domain_name != "" && enable_custom_domain_binding == true
```

This avoids failed applies before DNS is ready.

## Azure Portal Steps

The TXT validation token and the Static Web App inbound IP still need to be collected manually from Azure.

### 1. Get the TXT validation token

Portal path:

- Static Web App
- `Settings`
- `Custom domains`
- `+ Add`
- Enter `mmartga.com`
- Choose `TXT`
- Click `Generate code`

Use the generated Azure token as the GoDaddy TXT record value.

### 2. Get the stable inbound IP

Portal path:

- Static Web App
- `Overview`
- `JSON View`
- Find `stableInboundIP`

Use that IP address for the GoDaddy apex `A` record.

## GoDaddy DNS Records for mmartga.com

Because `mmartga.com` is the apex domain, use these records:

### TXT record

- Type: `TXT`
- Host: `@`
- Value: Azure-generated validation token
- TTL: default

### A record

- Type: `A`
- Host: `@`
- Value: Azure `stableInboundIP`
- TTL: default

## Important DNS Notes

- Do not use a `CNAME` at the root domain.
- In GoDaddy, use `@` for the apex host, not `mmartga.com`.
- Remove or avoid conflicting root `A`, `AAAA`, or forwarding rules.
- DNS propagation can take time, so validation may not succeed immediately.

## Terraform Flow

Use the existing deploy wrapper in this repo:

```bash
cd /home/ronin/projects/art-app/infra/terraform/nonprod
./deploy.sh init nonprod
./deploy.sh plan nonprod
./deploy.sh apply nonprod <plan_timestamp>
```

## Recommended Rollout Sequence

1. Add these values to `terraform.tfvars`:

```hcl
custom_domain_name              = "mmartga.com"
custom_domain_validation_method = "dns-txt-token"
enable_custom_domain_binding    = false
```

2. Run a normal Terraform apply with binding still disabled so the stack stays clean.
3. In Azure Portal, generate the TXT token for `mmartga.com`.
4. In Azure Portal, copy the `stableInboundIP`.
5. In GoDaddy, create the TXT and A records.
6. Wait for DNS propagation.
7. Change `enable_custom_domain_binding` to `true`.
8. Run `./deploy.sh plan nonprod` again.
9. Run `./deploy.sh apply nonprod <new_plan_timestamp>`.

## If Terraform Says the Custom Domain Already Exists

If Azure already created the domain binding before Terraform managed it, import it into state.

Template:

```bash
terraform import \
  'azapi_resource.art_app_custom_domain[0]' \
  '/subscriptions/<subscription_id>/resourceGroups/n-weu-rg-01-a01/providers/Microsoft.Web/staticSites/n-weu-art-swa-01-a01/customDomains/mmartga.com'
```

After the import:

```bash
./deploy.sh plan nonprod
./deploy.sh apply nonprod <new_plan_timestamp>
```

## TLS Handling

Azure Static Web Apps manages the TLS certificate automatically after the custom-domain binding succeeds.

## Notes

- GoDaddy DNS is still manual in this repo.
- Terraform now manages the Azure-side binding once DNS is ready.
- The GitHub Actions deployment token flow is unchanged by this custom-domain work.
