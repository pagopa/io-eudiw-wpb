resource "azurerm_cosmosdb_account" "main" {
  name                = "${var.project}-${var.domain}-cosno-01"
  location            = var.location
  resource_group_name = var.resource_group_name
  offer_type          = "Standard"

  consistency_policy {
    consistency_level       = "Strong"
    max_interval_in_seconds = null
    max_staleness_prefix    = null
  }

  geo_location {
    location          = var.location
    failover_priority = 0
    zone_redundant    = false
  }

  public_network_access_enabled     = true
  is_virtual_network_filter_enabled = false

  backup {
    type = "Continuous"
  }

  tags = var.tags
}
