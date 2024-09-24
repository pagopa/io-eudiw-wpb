module "func_api_role" {
  source       = "github.com/pagopa/dx//infra/modules/azure_role_assignments?ref=main"
  principal_id = module.func_api.function_app.function_app.principal_id

  cosmos = [
    {
      account_name        = var.cosmos_db.name
      resource_group_name = var.cosmos_db.resource_group_name
      database            = var.cosmos_db.database_name
      role                = "writer"
    }
  ]

}

module "func_api_slot_role" {
  count        = module.func_api.function_app.function_app.slot.principal_id != null ? 1 : 0
  source       = "github.com/pagopa/dx//infra/modules/azure_role_assignments?ref=main"
  principal_id = module.func_api.function_app.function_app.slot.principal_id

  cosmos = [
    {
      account_name        = var.cosmos_db.name
      resource_group_name = var.cosmos_db.resource_group_name
      database            = var.cosmos_db.database_name
      role                = "writer"
    }
  ]

}
