import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

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

  // Method to suggest a single task
  async suggestTask(): Promise<string> {
    const suggestions = [
      'مراجعة الدروس اليومية',
      'تنظيم المكتب',
      'كتابة الملاحظات',
      'تحضير العرض التقديمي',
      'إرسال البريد الإلكتروني المهم',
      'تحديث قائمة المهام'
    ];
    const randomIndex = Math.floor(Math.random() * suggestions.length);
    return suggestions[randomIndex];
  }
}
