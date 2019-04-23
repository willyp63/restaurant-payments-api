import { Test, TestingModule } from '@nestjs/testing';
import { TableItemController } from './table-item.controller';

describe('TableItem Controller', () => {
  let controller: TableItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableItemController],
    }).compile();

    controller = module.get<TableItemController>(TableItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
