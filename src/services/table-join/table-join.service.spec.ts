import { Test, TestingModule } from '@nestjs/testing';
import { TableJoinService } from './table-join.service';

describe('TableJoinService', () => {
  let service: TableJoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableJoinService],
    }).compile();

    service = module.get<TableJoinService>(TableJoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
