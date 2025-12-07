import { Test, TestingModule } from '@nestjs/testing';
import { TiposSistemaController } from './tipos-sistema.controller';

describe('TiposSistemaController', () => {
  let controller: TiposSistemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposSistemaController],
    }).compile();

    controller = module.get<TiposSistemaController>(TiposSistemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
