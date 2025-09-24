// src/api/helpers/testDataManager.js
export class TestDataManager {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.createdUsers = [];
    this.testStartTime = Date.now();
  }

  async createTestUser(userData) {
    const { res, json } = await this.apiClient.createUser(userData);
    if (res.status() === 201 && json?.id) {
      this.createdUsers.push({ id: json.id, name: json.name, createdAt: new Date().toISOString() });
    }
    return { res, json };
  }

  async cleanupCreatedUsers() {
    if (!this.createdUsers.length) return;
    await Promise.allSettled(this.createdUsers.map(u => this.apiClient.deleteUser(u.id)));
    this.createdUsers = [];
  }

  getTestMetrics() {
    return {
      testDurationMs: Date.now() - this.testStartTime,
      createdUsers: this.createdUsers.length,
      createdUserIds: this.createdUsers.map(u => u.id)
    };
  }
}
