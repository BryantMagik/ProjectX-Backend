import { Test, TestingModule } from '@nestjs/testing';
import { SubtasksController } from './subtasks.controller';

describe('SubtasksController', () => {
  let controller: SubtasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubtasksController],
    }).compile();

    controller = module.get<SubtasksController>(SubtasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
