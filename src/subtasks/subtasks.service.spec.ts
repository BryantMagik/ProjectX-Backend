import { Test, TestingModule } from '@nestjs/testing';
import { SubtasksService } from './subtasks.service';

describe('SubtasksService', () => {
  let service: SubtasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubtasksService],
    }).compile();

    service = module.get<SubtasksService>(SubtasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
