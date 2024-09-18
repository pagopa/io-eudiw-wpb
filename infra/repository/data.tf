data "azurerm_user_assigned_identity" "identity_dev_ci" {
  name                = "${local.project}-${local.domain}-github-ci-identity"
  resource_group_name = local.identity_resource_group_name
}

data "azurerm_user_assigned_identity" "identity_dev_cd" {
  name                = "${local.project}-${local.domain}-github-cd-identity"
  resource_group_name = local.identity_resource_group_name
}

data "azurerm_user_assigned_identity" "identity_app_dev_cd" {
  name                = "${local.project}-${local.domain}-app-github-cd-identity"
  resource_group_name = local.identity_resource_group_name
}

data "github_organization_teams" "all" {
  root_teams_only = true
  summary_only    = true
}
