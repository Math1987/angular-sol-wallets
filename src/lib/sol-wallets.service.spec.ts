import { TestBed } from '@angular/core/testing';

import { SolWalletsService } from './sol-wallets.service';

describe('SolWalletsService', () => {
  let service: SolWalletsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolWalletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
