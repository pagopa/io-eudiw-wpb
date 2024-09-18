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
