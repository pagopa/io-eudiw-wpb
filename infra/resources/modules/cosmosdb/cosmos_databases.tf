resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "db"
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.main.name
}
