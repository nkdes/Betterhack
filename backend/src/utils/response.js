class ApiResponse {
  constructor(success, data = null, message = null) {
    this.success = success;
    if (data) this.data = data;
    if (message) this.message = message;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message) {
    return new ApiResponse(true, data, message);
  }

  static error(message, data = null) {
    return new ApiResponse(false, data, message);
  }
}

module.exports = ApiResponse; 