import { describe, it, expect } from 'vitest';
import { GET } from '../route';

describe('Health Check Endpoint - Requirements 4.4', () => {
  it('should return status code 200', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('should return JSON with correct format', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
  });

  it('should return healthy status', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.status).toBe('healthy');
  });

  it('should return a valid ISO timestamp', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.timestamp).toBeDefined();
    expect(typeof data.timestamp).toBe('string');
    
    // Verify it's a valid ISO date string
    const date = new Date(data.timestamp);
    expect(date.toISOString()).toBe(data.timestamp);
  });

  it('should return current timestamp', async () => {
    const beforeCall = new Date();
    const response = await GET();
    const afterCall = new Date();
    const data = await response.json();
    
    const timestamp = new Date(data.timestamp);
    
    // Timestamp should be between before and after the call
    expect(timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
    expect(timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime());
  });
});
