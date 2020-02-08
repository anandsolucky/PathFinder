import { TestBed } from '@angular/core/testing';

import { AlgorithmServiceService } from './algorithm-service.service';

describe('AlgorithmServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlgorithmServiceService = TestBed.get(AlgorithmServiceService);
    expect(service).toBeTruthy();
  });
});
