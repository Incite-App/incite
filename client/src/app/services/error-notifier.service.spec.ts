import { TestBed, inject } from '@angular/core/testing';

import { ErrorNotifierService } from './error-notifier.service';

describe('ErrorNotifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorNotifierService]
    });
  });

  it('should be created', inject([ErrorNotifierService], (service: ErrorNotifierService) => {
    expect(service).toBeTruthy();
  }));
});
