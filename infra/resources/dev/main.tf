terraform {

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "<= 3.108.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "tfappdevio"
    container_name       = "terraform-state"
    key                  = "io-eudiw-wpb.resources.dev.westeurope.tfstate"
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "${local.project}-${local.domain}-rg-01"
  location = local.location

  tags = local.tags
}

module "app_insight" {
  source = "../modules/application_insights"

  project             = local.project
  location            = local.location
  domain              = local.domain
  resource_group_name = azurerm_resource_group.rg.name

  tags = local.tags
}

module "cosmos" {
  source = "../modules/cosmosdb"

  project             = local.project
  location            = local.location
  domain              = local.domain
  resource_group_name = azurerm_resource_group.rg.name

  # private_endpoint_subnet_id = data.azurerm_subnet.pep.id
  # private_link_documents_id  = data.azurerm_private_dns_zone.privatelink_documents.id

  tags = local.tags
}

module "function_api" {
  source = "../modules/function_api"

  prefix              = local.prefix
  env_short           = local.env_short
  location            = local.location
  domain              = local.domain
  resource_group_name = azurerm_resource_group.rg.name

  app_insights_connection_string = module.app_insight.connection_string

  cosmos_db = {
    name                = module.cosmos.cosmos_account.name
    resource_group_name = module.cosmos.cosmos_account.resource_group_name
    database_name       = module.cosmos.cosmos_account.database_name
    endpoint            = module.cosmos.cosmos_account.endpoint
  }

  tags = local.tags
}
