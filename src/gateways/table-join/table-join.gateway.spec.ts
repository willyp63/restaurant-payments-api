import { Test, TestingModule } from '@nestjs/testing';
import { TableJoinGateway } from './table-join.gateway';

describe('TableJoinGateway', () => {
  let gateway: TableJoinGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableJoinGateway],
    }).compile();

    gateway = module.get<TableJoinGateway>(TableJoinGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
