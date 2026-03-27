import { Module, Logger } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { CustomLogger } from 'src/logger/custom-logger.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [CustomLogger, { provide: Logger, useClass: CustomLogger }],
  exports: [Logger],
})
export class HealthModule {}
