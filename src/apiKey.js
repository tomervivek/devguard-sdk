class ApiKeyValidator {
  constructor(apiKeys = []) {
    this.apiKeys = new Set(apiKeys);
  }

  validate(key) {
    if (!key) {
      return false;
    }

    return this.apiKeys.has(key);
  }
}

module.exports = ApiKeyValidator;