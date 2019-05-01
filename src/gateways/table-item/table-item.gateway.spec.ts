import { Test, TestingModule } from '@nestjs/testing';
import { TableItemGateway } from './table-item.gateway';

describe('TableItemGateway', () => {
  let gateway: TableItemGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableItemGateway],
    }).compile();

    gateway = module.get<TableItemGateway>(TableItemGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
