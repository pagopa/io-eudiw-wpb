locals {
  app_settings = {
    NODE_ENV                       = "production"
    FUNCTIONS_WORKER_RUNTIME       = "node"
    FUNCTIONS_WORKER_PROCESS_COUNT = "4"

    // Keepalive fields are all optionals
    FETCH_KEEPALIVE_ENABLED             = "true"
    FETCH_KEEPALIVE_SOCKET_ACTIVE_TTL   = "110000"
    FETCH_KEEPALIVE_MAX_SOCKETS         = "40"
    FETCH_KEEPALIVE_MAX_FREE_SOCKETS    = "10"
    FETCH_KEEPALIVE_FREE_SOCKET_TIMEOUT = "30000"
    FETCH_KEEPALIVE_TIMEOUT             = "60000"

    WEBSITE_SWAP_WARMUP_PING_PATH     = "/info"
    WEBSITE_SWAP_WARMUP_PING_STATUSES = "200"

    COSMOSDB_ENDPOINT      = var.cosmos_db.endpoint
    COSMOSDB_DATABASE_NAME = var.cosmos_db.database_name
  }
}
