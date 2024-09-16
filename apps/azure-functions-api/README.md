# Azure Function API

This application implements the code about EUDI Wallet Provider backend.

## ENV variables

The following table contains the required ENV variables that the applicative require

| Variable name                      | Description                                  | type    |
|------------------------------------|----------------------------------------------|---------|
| APPINSIGHTS_INSTRUMENTATIONKEY     | The Application Insights instrumentation key | string  |
| FETCH_TIMEOUT_MS                   | (optional) Fetch Timeout for AbortableFetch  | number  |

## Local Execution

To execute locally the function copy the configuration from the `env.example` file with:

```bash
cp .env.example .env
```

Then you can start the function using the following command:
```bash
yarn start
```
