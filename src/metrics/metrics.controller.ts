import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import type { MetricsResponse } from '../types/metrics.types';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  getMetrics(): MetricsResponse {
    return this.metricsService.getMetrics();
  }
}
