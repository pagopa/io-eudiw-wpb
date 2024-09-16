locals {
  prefix    = "io"
  env_short = "p"
  repo_name = "io-eudiw-wpb"

  tags = {
    CostCenter  = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy   = "Terraform"
    Environment = "Prod"
    Owner       = "DevEx"
    Source      = "https://github.com/pagopa/io-eudiw-wpb/blob/main/infra/github-runner/prod/westeurope"
  }
}
