class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  check(ip) {
    const now = Date.now();

    const record = this.requests.get(ip);

    if (!record) {
      this.requests.set(ip, {
        count: 1,
        startTime: now
      });

      return true;
    }

    const timePassed = now - record.startTime;

    if (timePassed > this.windowMs) {
      this.requests.set(ip, {
        count: 1,
        startTime: now
      });

      return true;
    }

    if (record.count >= this.maxRequests) {
      return false;
    }

    record.count++;

    return true;
  }
}

module.exports = RateLimiter;