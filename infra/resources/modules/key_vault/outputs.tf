output "key_vault" {
  value = {
    id                  = azurerm_key_vault.main.id
    name                = azurerm_key_vault.main.name
    resource_group_name = azurerm_key_vault.main.resource_group_name
  }
}
