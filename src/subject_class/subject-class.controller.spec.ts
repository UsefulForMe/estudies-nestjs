import { Test, TestingModule } from '@nestjs/testing';
import { SubjectClassController } from './subject-class.controller';

describe('SubjectClassController', () => {
  let controller: SubjectClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectClassController],
    }).compile();

    controller = module.get<SubjectClassController>(SubjectClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
