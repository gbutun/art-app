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

output "static_web_app_api_key" {
  description = "Deployment token for CI/CD publishing."
  value       = azurerm_static_web_app.art_app.api_key
  sensitive   = true
}
