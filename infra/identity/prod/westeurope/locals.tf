locals {
  prefix    = "dx"
  env_short = "p"
  env       = "prod"
  location  = "westeurope"
  project   = "${local.prefix}-${local.env_short}"
  domain    = "typescript"

  repo_name = "io-eudiw-wpb"

  tags = {
    CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy   = "Terraform"
    Environment = "Prod"
    Owner       = "DevEx"
    Source      = "https://github.com/pagopa/io-eudiw-wpb/blob/main/infra/identity/prod/westeurope"
  }
}
