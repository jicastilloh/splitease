import { Controller, Get, Logger} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { Public } from 'src/auth/public.decorator';

@Controller('health')
@ApiTags('Health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private memory: MemoryHealthIndicator,
        private readonly logger: Logger
    ) {}

    @Get()
    @ApiResponse({ status: 200, description: 'Health check satisfactorio' })
    @ApiResponse({ status: 503, description: 'Servicio no disponible' })
    @ApiOperation({ summary: 'realiza un health check a la aplicación' })
    @Public()
    @HealthCheck()
    check() {
        this.logger.debug('Health check requested');
        this.logger.log('Health check OK');
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        ]);
    }
}
