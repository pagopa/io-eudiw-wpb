resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.project}-${var.domain}-law-01"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = var.tags
}

resource "azurerm_application_insights" "main" {
  name                = "${var.project}-${var.domain}-ai-01"
  location            = var.location
  resource_group_name = var.resource_group_name
  application_type    = "other"

  workspace_id = azurerm_log_analytics_workspace.main.id

  tags = var.tags
}
