import { Test, TestingModule } from '@nestjs/testing';
import { TableItemService } from './table-item.service';

describe('TableItemService', () => {
  let service: TableItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableItemService],
    }).compile();

    service = module.get<TableItemService>(TableItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
