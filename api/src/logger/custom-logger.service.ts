import { ConsoleLogger, Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
    private readonly level: string;
    private readonly env: string;

    constructor(){
        super();
        this.env = process.env.NODE_ENV || 'development';
        this.level = process.env.LOG_LEVEL || (this.env === 'production' ? 'warn' : 'debug');
    }

    log(message: string, context?: string) {
        if (['log', 'info', 'verbose', 'debug'].includes(this.level) || this.level === 'debug') {
            super.log(this.format('info', message), context);
        }
    }

    error(message: string, trace?: string, context?: string) {
        if (['log', 'info', 'verbose', 'debug', 'error'].includes(this.level)) {
            super.error(this.format('error', message), trace, context);
        }
    }

    warn(message: string, context?: string) {
        if (['log', 'info', 'verbose', 'debug', 'warn'].includes(this.level)) {
            super.warn(this.format('warn', message), context);
        }
    }   
    
    debug(message: string, context?: string) {
        if (['debug'].includes(this.level)) {
            super.debug(this.format('debug', message, context), context);
        }
    }

    verbose(message: string, context?: string) {
        if (['verbose', 'debug'].includes(this.level) || this.level === 'debug') {
            super.verbose(this.format('verbose', message, context), context);
        }
    }

    private format(level: string, message: string, context?: string) {
        return JSON.stringify({
            level,
            timestamp: new Date().toISOString(),
            env: this.env,
            context,
            message,
        });
    }
}


