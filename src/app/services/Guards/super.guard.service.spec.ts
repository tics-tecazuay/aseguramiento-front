import { TestBed } from '@angular/core/testing';

import { SuperGuardService } from './super.guard';

describe('SuperGuardService', () => {
  let service: SuperGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
