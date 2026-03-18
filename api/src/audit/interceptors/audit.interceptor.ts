import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../database/entities/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditInterceptor');

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, ip } = request;

    // Apenas auditamos mutações (POST, PATCH, PUT, DELETE)
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(async (data) => {
          try {
            const auditLog = this.auditLogRepository.create({
              userId: user?.userId || 'anonymous',
              username: user?.username || 'anonymous',
              action: this.getMappedAction(method),
              resource: this.getResourceFromUrl(url),
              payload: body,
              ipAddress: ip,
            });

            await this.auditLogRepository.save(auditLog);
            this.logger.log(`Audit Log salvo: ${method} ${url}`);
          } catch (error) {
            this.logger.error('Erro ao salvar Audit Log', error.stack);
          }
        }),
      );
    }

    return next.handle();
  }

  private getMappedAction(method: string): string {
    const map = {
      POST: 'CREATE',
      PATCH: 'UPDATE',
      PUT: 'UPDATE',
      DELETE: 'DELETE',
    };
    return map[method] || method;
  }

  private getResourceFromUrl(url: string): string {
    const parts = url.split('/');
    // Assume /api/v1/resource/...
    return parts[3] ? parts[3].toUpperCase() : 'UNKNOWN';
  }
}
