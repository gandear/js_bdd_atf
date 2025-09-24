// src/utils/cleanup-reporter.js
import fs from 'fs/promises';
import path from 'path';

class CleanupReporter {
  constructor(options = {}) {
    this.retentionDays = options.retentionDays || 7;
    this.cleanupOnSuccess = options.cleanupOnSuccess !== false;
  }

  async onEnd(result) {
    // Handle case when no tests are found
    if (!result || typeof result !== 'object') {
      console.log(`\n🧹 Cleanup Reporter: No test results found`);
      return;
    }

    const { status, passed = 0, failed = 0 } = result;
    
    console.log(`\n🧹 Cleanup Reporter: Tests completed with ${passed} passed, ${failed} failed`);

    // Skip cleanup if no tests were executed
    if (passed === 0 && failed === 0) {
      console.log('ℹ️  No tests executed, skipping cleanup');
      return;
    }

    // Cleanup strategy based on results
    if (this.cleanupOnSuccess && failed === 0) {
      await this.cleanupSuccessfulTestArtifacts();
    }

    // Always enforce retention policy
    await this.enforceRetentionPolicy();
  }

  async cleanupSuccessfulTestArtifacts() {
    const testResultsPath = './test-results';
    
    try {
      const exists = await this.pathExists(testResultsPath);
      if (!exists) return;

      // Check if directory is empty or contains only minimal files
      const isEmpty = await this.isDirectoryMinimal(testResultsPath);
      
      if (isEmpty) {
        await fs.rm(testResultsPath, { recursive: true, force: true });
        console.log('✅ Cleaned up empty test-results folder');
      } else {
        // Cleanup only API test results if they're empty (no failures)
        await this.cleanupApiResults();
      }
    } catch (error) {
      console.warn(`⚠️  Could not cleanup test-results: ${error.message}`);
    }
  }

  async cleanupApiResults() {
    const apiResultsPath = './test-results/api';
    
    try {
      const exists = await this.pathExists(apiResultsPath);
      if (!exists) return;

      const isEmpty = await this.isDirectoryMinimal(apiResultsPath);
      if (isEmpty) {
        await fs.rm(apiResultsPath, { recursive: true, force: true });
        console.log('✅ Cleaned up API test-results (no failures)');
      }
    } catch (error) {
      console.warn(`⚠️  Could not cleanup API results: ${error.message}`);
    }
  }

  async enforceRetentionPolicy() {
    const folders = ['./test-results', './allure-results', './logs'];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

    for (const folder of folders) {
      try {
        await this.cleanOldFiles(folder, cutoffDate);
      } catch (error) {
        console.warn(`⚠️  Could not enforce retention for ${folder}: ${error.message}`);
      }
    }
  }

  async cleanOldFiles(folderPath, cutoffDate) {
    const exists = await this.pathExists(folderPath);
    if (!exists) return;

    const items = await fs.readdir(folderPath, { withFileTypes: true });
    let cleanedCount = 0;

    for (const item of items) {
      const itemPath = path.join(folderPath, item.name);
      const stats = await fs.stat(itemPath);

      if (stats.mtime < cutoffDate) {
        if (item.isDirectory()) {
          await fs.rm(itemPath, { recursive: true, force: true });
        } else {
          await fs.unlink(itemPath);
        }
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🗑️  Cleaned ${cleanedCount} old items from ${folderPath}`);
    }
  }

  async pathExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async isDirectoryMinimal(dirPath) {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      
      // Consider directory minimal if:
      // 1. Empty
      // 2. Contains only small metadata files (< 1KB)
      if (items.length === 0) return true;

      let totalSize = 0;
      for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        if (item.isDirectory()) {
          // If contains subdirectories, check if they're minimal too
          const subDirMinimal = await this.isDirectoryMinimal(itemPath);
          if (!subDirMinimal) return false;
        } else {
          const stats = await fs.stat(itemPath);
          totalSize += stats.size;
        }
      }

      // Consider minimal if total size < 10KB (just metadata)
      return totalSize < 10 * 1024;
    } catch {
      return false;
    }
  }
}

// Export pentru Playwright
export default CleanupReporter;