import { Test, TestingModule } from '@nestjs/testing';
import { HistorialStatusController } from './historial-status.controller';

describe('HistorialStatusController', () => {
  let controller: HistorialStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialStatusController],
    }).compile();

    controller = module.get<HistorialStatusController>(HistorialStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
