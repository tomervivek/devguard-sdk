# DevGuard SDK

A lightweight Node.js SDK for protecting Express APIs with:

- API key validation
- IP blocking
- Request rate limiting
- Request logging

## Installation

```bash
npm install devguard-sdk
```

## Public API

The package currently exports a single public class: `DevGuard`.

The lower-level helper classes used internally by the SDK (`RateLimiter`, `ApiKeyValidator`, `IpBlocker`, and `Logger`) are not exported from the package root.

## Usage

```js
const { DevGuard } = require("devguard-sdk");

const app = require("express")();
const devGuard = new DevGuard({
  maxRequests: 100,
  windowMs: 60000,
  apiKeys: ["demo-key-123"],
  blockedIps: ["127.0.0.1"]
});

app.use(devGuard.middleware());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Hello from DevGuard SDK" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## API

### `new DevGuard(options = {})`

Creates a DevGuard instance.

Available options:

- `maxRequests`: Maximum number of requests allowed per IP within the time window. Default: `100`
- `windowMs`: Time window in milliseconds. Default: `60000`
- `apiKeys`: Array of valid API keys. Default: `[]`
- `blockedIps`: Array of blocked IP addresses. Default: `[]`

### `devGuard.middleware()`

Returns an Express middleware that:

1. Logs request details
2. Blocks requests from blocked IPs with `403`
3. Enforces request rate limits with `429`
4. Allows the request to continue when checks pass

### `devGuard.apiKeyMiddleware()`

Returns an Express middleware that validates the `x-api-key` header.

- Valid key: continues to the next middleware/route
- Missing or invalid key: responds with `401`

### `devGuard.validateApiKey(key)`

Checks whether a provided API key is valid.

```js
const isValid = devGuard.validateApiKey("demo-key-123");
console.log(isValid); // true
```

## Example: API key protection

```js
const { DevGuard } = require("devguard-sdk");

const app = require("express")();
const devGuard = new DevGuard({
  apiKeys: ["secret-key"]
});

app.use(devGuard.apiKeyMiddleware());

app.get("/secure", (req, res) => {
  res.json({ success: true, message: "Authorized access" });
});
```

## Notes

- The SDK is designed for simple Express-based API protection.
- The rate limiter uses in-memory tracking per IP address.
- This means requests are not shared across multiple server instances.

## License

MIT
