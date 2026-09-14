class Logger {
  log(req) {
    console.log({
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      time: new Date().toISOString()
    });
  }
}

module.exports = Logger;