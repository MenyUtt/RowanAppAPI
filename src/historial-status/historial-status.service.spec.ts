import { Test, TestingModule } from '@nestjs/testing';
import { HistorialStatusService } from './historial-status.service';

describe('HistorialStatusService', () => {
  let service: HistorialStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistorialStatusService],
    }).compile();

    service = module.get<HistorialStatusService>(HistorialStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
