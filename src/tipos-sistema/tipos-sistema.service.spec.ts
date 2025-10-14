import { Test, TestingModule } from '@nestjs/testing';
import { TiposSistemaService } from './tipos-sistema.service';

describe('TiposSistemaService', () => {
  let service: TiposSistemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiposSistemaService],
    }).compile();

    service = module.get<TiposSistemaService>(TiposSistemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
