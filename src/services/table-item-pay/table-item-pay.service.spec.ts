import { Test, TestingModule } from '@nestjs/testing';
import { TableItemPayService } from './table-item-pay.service';

describe('TableItemPayService', () => {
  let service: TableItemPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableItemPayService],
    }).compile();

    service = module.get<TableItemPayService>(TableItemPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
