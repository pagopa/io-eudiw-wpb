module "func_api" {
  source = "github.com/pagopa/dx//infra/modules/azure_function_app_exposed?ref=ef47443"

  environment = {
    prefix          = var.prefix
    env_short       = var.env_short
    location        = var.location
    domain          = var.domain
    app_name        = "api"
    instance_number = "01"
  }

  resource_group_name = var.resource_group_name
  health_check_path   = "/info"
  node_version        = 20

  # All async trigger shutdown initially
  app_settings = merge(
    local.app_settings,
    {}
  )

  slot_app_settings = merge(
    local.app_settings,
    {}
  )

  tier = "standard"

  tags = var.tags
}
