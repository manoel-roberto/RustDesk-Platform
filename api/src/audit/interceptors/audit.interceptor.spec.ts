import { Test, TestingModule } from '@nestjs/testing';
import { AuditInterceptor } from './audit.interceptor';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from '../../database/entities/audit-log.entity';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('AuditInterceptor', () => {
  let interceptor: AuditInterceptor;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditInterceptor,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: {
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    interceptor = module.get<AuditInterceptor>(AuditInterceptor);
    repository = module.get(getRepositoryToken(AuditLog));
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should audit POST, PATCH, PUT, DELETE requests', async () => {
    const mockRequest = {
      method: 'POST',
      url: '/api/v1/devices',
      body: { name: 'test' },
      user: { sub: 'user1', preferred_username: 'testuser' },
      ip: '127.0.0.1',
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler = {
      handle: () => of({ success: true }),
    } as CallHandler;

    const result = await interceptor.intercept(mockContext, mockCallHandler).toPromise();
    
    expect(result).toEqual({ success: true });
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });

  it('should not audit GET requests', async () => {
    const mockRequest = {
      method: 'GET',
      url: '/api/v1/devices',
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler = {
      handle: () => of([{ id: 1 }]),
    } as CallHandler;

    const result = await interceptor.intercept(mockContext, mockCallHandler).toPromise();
    
    expect(result).toEqual([{ id: 1 }]);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should handle anonymous users', async () => {
    const mockRequest = {
      method: 'POST',
      url: '/api/v1/groups',
      body: {},
      user: null,
      ip: '10.0.0.1',
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler = {
      handle: () => of({}),
    } as CallHandler;

    await interceptor.intercept(mockContext, mockCallHandler).toPromise();
    
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'anonymous',
      username: 'anonymous',
    }));
  });
});
