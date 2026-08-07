class ApiResponse {
  constructor(success, message, data = null, count = null) {
    this.success = success;
    this.message = message;
    if (count !== null) this.count = count;
    if (data !== null) this.data = data;
  }
}

module.exports = ApiResponse;
