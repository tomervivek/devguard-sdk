const RateLimiter = require("./rateLimiter");
const ApiKeyValidator = require("./apiKey");
const Logger = require("./logger");
const IpBlocker = require("./ipBlocker");
class DevGuard {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 100;
    this.windowMs = options.windowMs || 60000;

    this.rateLimiter = new RateLimiter(
      this.maxRequests,
      this.windowMs
    );

    this.apiKeyValidator = new ApiKeyValidator(
      options.apiKeys || []
    );
this.ipBlocker = new IpBlocker(
  options.blockedIps || []
);
    this.logger = new Logger();
  }

middleware() {
  return (req, res, next) => {
    this.logger.log(req);

    const ip = req.ip;

    if (this.ipBlocker.isBlocked(ip)) {
      return res.status(403).json({
        success: false,
        message: "Your IP address has been blocked"
      });
    }

    const allowed = this.rateLimiter.check(ip);

    if (!allowed) {
      return res.status(429).json({
        success: false,
        message: "Too many requests"
      });
    }

    next();
  };
}

  validateApiKey(key) {
    return this.apiKeyValidator.validate(key);
  }

  apiKeyMiddleware() {
    return (req, res, next) => {
      const apiKey = req.headers["x-api-key"];

      const isValid = this.validateApiKey(apiKey);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid or missing API key"
        });
      }

      next();
    };
  }
}

module.exports = DevGuard;