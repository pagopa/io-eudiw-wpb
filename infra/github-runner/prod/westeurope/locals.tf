locals {
  prefix    = "io"
  env_short = "p"
  repo_name = "dx-typescript"

  tags = {
    CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy   = "Terraform"
    Environment = "Prod"
    Owner       = "DevEx"
    Source      = "https://github.com/pagopa/dx-typescript/blob/main/infra/github-runner/prod/westeurope"
  }
}
