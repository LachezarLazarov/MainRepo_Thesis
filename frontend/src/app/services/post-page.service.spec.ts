import { TestBed } from '@angular/core/testing';

import { PostPageService } from './post-page.service';

describe('PostPageService', () => {
  let service: PostPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
