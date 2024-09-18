locals {
  prefix    = "io"
  env_short = "d"
  env       = "dev"
  location  = "italynorth"
  project   = "${local.prefix}-${local.env_short}"
  domain    = "eudiw"

  repo_name = "io-eudiw-wpb"

  tags = {
    CostCenter     = "TS310 - PAGAMENTI & SERVIZI"
    CreatedBy      = "Terraform"
    Environment    = "Dev"
    Owner          = "IO"
    ManagementTeam = "IO Wallet"
    Source         = "https://github.com/pagopa/io-eudiw-wpb/blob/main/infra/resources"
  }
}
