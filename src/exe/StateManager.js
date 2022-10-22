class StateManager {
  constructor() {
    this.errorCount = 0;
    this.warningCount = 0;
    this.successCount = 0;
  }

  reportError(message) {
    console.log(`Error: ${message}`);
    this.errorCount += 1;
  }

  reportWarning(message) {
    console.log(`Warning: ${message}`);
    this.warningCount += 1;
  }

  reportSuccess(message) {
    console.log(`Success: ${message}`);
    this.successCount += 1;
  }

  get status() {
    return `
      Success: ${this.successCount}
      Error: ${this.errorCount}
      Warning: ${this.warningCount}
    `;
  }
}

module.exports = new StateManager();
