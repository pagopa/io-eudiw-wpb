output "cosmos_account" {
  value = {
    id                  = azurerm_cosmosdb_account.main.id
    name                = azurerm_cosmosdb_account.main.name
    resource_group_name = azurerm_cosmosdb_account.main.resource_group_name
    endpoint            = azurerm_cosmosdb_account.main.endpoint
    database_name       = azurerm_cosmosdb_sql_database.db.name
    primary_key         = azurerm_cosmosdb_account.main.primary_key
  }
}
