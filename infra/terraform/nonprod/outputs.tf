output "resource_group_name" {
  description = "Resource group for the app."
  value       = azurerm_resource_group.art_app.name
}

output "static_web_app_name" {
  description = "Static Web App resource name."
  value       = azurerm_static_web_app.art_app.name
}

output "static_web_app_default_host_name" {
  description = "Default public hostname for the Static Web App."
  value       = azurerm_static_web_app.art_app.default_host_name
}

output "custom_domain_name" {
  description = "Requested custom domain name for the Static Web App."
  value       = var.custom_domain_name != "" ? var.custom_domain_name : null
}

output "custom_domain_binding_enabled" {
  description = "Whether Terraform is currently allowed to create the Static Web App custom domain binding."
  value       = var.enable_custom_domain_binding
}

output "static_web_app_api_key" {
  description = "Deployment token for CI/CD publishing."
  value       = azurerm_static_web_app.art_app.api_key
  sensitive   = true
}

output "asset_storage_account_name" {
  description = "Storage account that serves nonprod art-app assets."
  value       = azurerm_storage_account.art_app_assets.name
}

output "asset_container_name" {
  description = "Blob container that stores nonprod art-app assets."
  value       = azurerm_storage_container.art_app_assets.name
}

output "asset_base_url" {
  description = "Base URL to use as NONPROD_ASSET_BASE_URL for nonprod website assets."
  value       = local.asset_base_url
}
