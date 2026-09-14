class IpBlocker {
  constructor(blockedIps = []) {
    this.blockedIps = new Set(blockedIps);
  }

  isBlocked(ip) {
    return this.blockedIps.has(ip);
  }

  block(ip) {
    this.blockedIps.add(ip);
  }

  unblock(ip) {
    this.blockedIps.delete(ip);
  }
}

module.exports = IpBlocker;