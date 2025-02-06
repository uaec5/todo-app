import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatgptService {
  private readonly apiUrl = 'https://api.perplexity.ai/chat/completions';
  private readonly apiKey = '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';
  private previousSuggestions: Set<string> = new Set();
  private lastSuggestionTime: number = 0;
  private readonly COOLDOWN_PERIOD = 60000; // 1 minute cooldown

  constructor(private http: HttpClient) {}

  async suggestTask(): Promise<string | null> {
    const currentTime = Date.now();
    if (currentTime - this.lastSuggestionTime < this.COOLDOWN_PERIOD) {
      return null;
    }

    const timeOfDay = this.getTimeOfDay();
    const prompt = this.createPrompt(timeOfDay);

    try {
      const response = await firstValueFrom(
        this.http.post(this.apiUrl, {
          model: "pplx-7b-chat",
          messages: [
            {
              role: 'system',
              content: 'أنت مساعد ذكي يقترح مهام يومية مفيدة باللغة العربية. اقترح مهمة واحدة فقط تكون مناسبة للوقت الحالي من اليوم.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        })
      );

      const suggestion = this.extractSuggestion(response);
      if (suggestion && !this.previousSuggestions.has(suggestion)) {
        this.previousSuggestions.add(suggestion);
        if (this.previousSuggestions.size > 10) {
          this.previousSuggestions.clear();
        }
        this.lastSuggestionTime = currentTime;
        return suggestion;
      }
      return null;
    } catch (error) {
      console.error('Error getting suggestion:', error);
      return this.getFallbackSuggestion();
    }
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'صباح';
    if (hour >= 12 && hour < 17) return 'ظهر';
    if (hour >= 17 && hour < 22) return 'مساء';
    return 'ليل';
  }

  private createPrompt(timeOfDay: string): string {
    return `اقترح مهمة واحدة مفيدة ومناسبة لوقت ${timeOfDay}. يجب أن تكون المهمة:
    1. محددة وقابلة للتنفيذ
    2. مناسبة للوقت الحالي من اليوم
    3. مفيدة للصحة أو الإنتاجية
    4. مختصرة (لا تزيد عن 10 كلمات)
    5. تبدأ بفعل مضارع`;
  }

  private extractSuggestion(response: any): string | null {
    try {
      return response.choices[0].message.content.trim();
    } catch {
      return null;
    }
  }

  private getFallbackSuggestion(): string {
    const hour = new Date().getHours();
    let tasks: string[];

    if (hour >= 5 && hour < 12) {
      tasks = [
        'تناول فطور صحي متكامل',
        'ممارسة تمارين الصباح لمدة 20 دقيقة',
        'قراءة الأخبار اليومية',
        'تحضير قائمة مهام اليوم',
        'شرب كوب ماء دافئ مع الليمون'
      ];
    } else if (hour >= 12 && hour < 17) {
      tasks = [
        'تناول وجبة غداء صحية',
        'المشي لمدة 15 دقيقة',
        'مراجعة البريد الإلكتروني',
        'ترتيب مكتب العمل',
        'أخذ استراحة قصيرة للتأمل'
      ];
    } else {
      tasks = [
        'قراءة كتاب لمدة 30 دقيقة',
        'ممارسة تمارين خفيفة',
        'تحضير قائمة مهام الغد',
        'ترتيب غرفة النوم',
        'الاستماع إلى موسيقى هادئة'
      ];
    }

    const randomIndex = Math.floor(Math.random() * tasks.length);
    return tasks[randomIndex];
  }

  enhanceTaskDescription(task: string): Observable<string> {
    return of(task);
  }
}
