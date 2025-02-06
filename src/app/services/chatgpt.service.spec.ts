import { TestBed } from '@angular/core/testing';
import { ChatgptService } from './chatgpt.service';
import { firstValueFrom } from 'rxjs';

describe('ChatgptService', () => {
  let service: ChatgptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatgptService]
    });
    service = TestBed.inject(ChatgptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return suggestions', async () => {
    const suggestions = await firstValueFrom(service.getSuggestions('test prompt'));
    expect(Array.isArray(suggestions)).toBeTrue();
    expect(suggestions.length).toBeGreaterThan(0);
    suggestions.forEach(suggestion => {
      expect(typeof suggestion).toBe('string');
    });
  });

  it('should suggest a single task', async () => {
    const suggestion = await service.suggestTask();
    expect(typeof suggestion).toBe('string');
    expect(suggestion.length).toBeGreaterThan(0);
  });
});
