locals {
  product_name_with_environment = format("%s (%s)", var.product_name_long, var.environment_long)
  resource_prefix               = "${var.environment_short}-${var.location_short}"

  default_tags = {
    company     = var.company_name_long
    product     = local.product_name_with_environment
    environment = var.environment_long
    region      = var.location
    managed_by  = "terraform"
    repo        = var.repository_url
  }

  merged_tags = merge(local.default_tags, var.tags)

  resource_group_name = var.resource_group_name_override != "" ? var.resource_group_name_override : "${local.resource_prefix}-rg-01-${var.product_unique}"

  static_web_app_name = var.static_web_app_name_override != "" ? var.static_web_app_name_override : "${local.resource_prefix}-${var.product_name_short}-swa-01-${var.product_unique}"
}

resource "azurerm_resource_group" "this" {
  name     = local.resource_group_name
  location = var.location
  tags     = local.merged_tags
}

resource "azurerm_static_web_app" "this" {
  name                = local.static_web_app_name
  resource_group_name = azurerm_resource_group.this.name
  location            = azurerm_resource_group.this.location
  sku_tier            = var.static_web_app_sku_tier
  sku_size            = var.static_web_app_sku_size
  tags                = local.merged_tags
}
