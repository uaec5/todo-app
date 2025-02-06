import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatgptService {
  constructor() { }

  // Placeholder method that returns mock suggestions
  getSuggestions(prompt: string): Observable<string[]> {
    console.log('Prompt received:', prompt);
    const mockSuggestions = [
      'اكمال الواجب المنزلي',
      'قراءة كتاب جديد',
      'ممارسة الرياضة',
      'التحضير للاختبار القادم'
    ];
    return of(mockSuggestions);
  }
}
