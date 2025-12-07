import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionesTicketsService } from './asignaciones-tickets.service';

describe('AsignacionesTicketsService', () => {
  let service: AsignacionesTicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsignacionesTicketsService],
    }).compile();

    service = module.get<AsignacionesTicketsService>(AsignacionesTicketsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
