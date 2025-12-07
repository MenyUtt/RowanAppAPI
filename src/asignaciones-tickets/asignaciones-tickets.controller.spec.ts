import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionesTicketsController } from './asignaciones-tickets.controller';

describe('AsignacionesTicketsController', () => {
  let controller: AsignacionesTicketsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsignacionesTicketsController],
    }).compile();

    controller = module.get<AsignacionesTicketsController>(AsignacionesTicketsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
