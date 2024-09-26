locals {
  cosmosdb_containers = [
    # Each document represents a wallet instance
    {
      name               = "wallet-instances"
      partition_key_path = "/userId"
      autoscale_settings = {
        max_throughput = 1000
      }
      default_ttl = null
    },
    # Each document represents a nonce
    {
      name               = "nonces"
      partition_key_path = "/id"
      autoscale_settings = {
        max_throughput = 1000
      }
      default_ttl = 300
    }
  ]
}
