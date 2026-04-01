variable "subscription_id" {
  type        = string
  description = "Azure subscription ID that will host the application."
}

variable "location" {
  type        = string
  description = "Azure region for app resources."
  default     = "canadacentral"
}

variable "location_short" {
  type        = string
  description = "Short region code used in naming."
  default     = "cac"
}

variable "environment_long" {
  type        = string
  description = "Environment long name."
  default     = "nonprod"
}

variable "environment_short" {
  type        = string
  description = "Environment short code used in naming."
  default     = "n"
}

variable "company_name_long" {
  type        = string
  description = "Owning company or team name."
}

variable "product_name_long" {
  type        = string
  description = "Friendly application name."
}

variable "product_name_short" {
  type        = string
  description = "Short application code used in resource names."
}

variable "product_unique" {
  type        = string
  description = "Unique suffix to keep names globally distinct."
}

variable "resource_group_name_override" {
  type        = string
  description = "Optional explicit resource group name."
  default     = ""
}

variable "static_web_app_name_override" {
  type        = string
  description = "Optional explicit Static Web App name."
  default     = ""
}

variable "static_web_app_sku_tier" {
  type        = string
  description = "Static Web App SKU tier."
  default     = "Standard"
}

variable "static_web_app_sku_size" {
  type        = string
  description = "Static Web App SKU size."
  default     = "Standard"
}

variable "repository_url" {
  type        = string
  description = "Optional repository URL for documentation."
  default     = ""
}

variable "tags" {
  type        = map(string)
  description = "Additional tags to merge into all resources."
  default     = {}
}
