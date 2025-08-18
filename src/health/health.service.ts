import { Injectable } from '@nestjs/common';
import { calculateUptime } from '../common/utils/uptime.util';

@Injectable()
export class HealthService {
  private readonly startTime = new Date();

  getHealthStatus() {
    const now = new Date();
    const uptime = calculateUptime(this.startTime);

    return {
      status: 'ok',
      timestamp: now.toISOString(),
      uptime,
    };
  }
}
