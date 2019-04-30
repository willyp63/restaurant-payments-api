import { Test, TestingModule } from '@nestjs/testing';
import { TableItemPayGateway } from './table-item-pay.gateway';

describe('TableItemPayGateway', () => {
  let gateway: TableItemPayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableItemPayGateway],
    }).compile();

    gateway = module.get<TableItemPayGateway>(TableItemPayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
