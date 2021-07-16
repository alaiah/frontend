import { TestBed } from '@angular/core/testing';

import { AlaiahFormService } from './alaiah-form.service';

describe('AlaiahFormService', () => {
  let service: AlaiahFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlaiahFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
