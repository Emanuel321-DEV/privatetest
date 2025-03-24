import { Test, TestingModule } from '@nestjs/testing';
import { WebchatMockService } from './webchat-mock.service';

describe('WebchatMockService', () => {
  let service: WebchatMockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebchatMockService],
    }).compile();

    service = module.get<WebchatMockService>(WebchatMockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
