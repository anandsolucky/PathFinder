import { TestBed } from '@angular/core/testing';

import { PathServiceService } from './path-service.service';

describe('PathServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PathServiceService = TestBed.get(PathServiceService);
    expect(service).toBeTruthy();
  });
});
