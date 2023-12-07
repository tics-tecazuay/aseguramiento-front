import { TestBed } from '@angular/core/testing';

import { AutoridadGuardService } from './autoridad.guard';

describe('AutoridadGuardService', () => {
  let service: AutoridadGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoridadGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
