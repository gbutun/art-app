locals {
  asset_storage_account_name = lower(replace("${var.environment_short}${var.location_short}${var.product_name_short}sa01${var.product_unique}", "-", ""))
  asset_container_name       = var.asset_container_name_override != "" ? var.asset_container_name_override : "artifacts"
  asset_base_url             = "https://${azurerm_storage_account.art_app_assets.name}.blob.core.windows.net/${azurerm_storage_container.art_app_assets.name}"
}

resource "azurerm_storage_account" "art_app_assets" {
  name                            = local.asset_storage_account_name
  resource_group_name             = azurerm_resource_group.art_app.name
  location                        = azurerm_resource_group.art_app.location
  account_kind                    = "StorageV2"
  account_tier                    = "Standard"
  account_replication_type        = var.asset_storage_account_replication_type
  access_tier                     = "Hot"
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = true
  tags                            = local.merged_tags

  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "HEAD", "OPTIONS"]
      allowed_origins    = var.asset_cors_allowed_origins
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }
}

resource "azurerm_storage_container" "art_app_assets" {
  name                  = local.asset_container_name
  storage_account_id    = azurerm_storage_account.art_app_assets.id
  container_access_type = "blob"
}
