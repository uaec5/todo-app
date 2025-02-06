import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-digital-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="clock-container">
      <div class="clock-content">
        <div class="date-section">
          <div class="day">{{ dayName }}</div>
          <div class="date">{{ dateStr }}</div>
        </div>
        <div class="divider"></div>
        <div class="time-section">
          <div class="time">{{ timeStr }}</div>
          <div class="period">{{ period }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .clock-container {
      background: linear-gradient(145deg, #2c3e50, #34495e);
      border-radius: 25px;
      padding: 2.5rem;
      color: white;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2);
      height: 100%;
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .clock-content {
      width: 100%;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .date-section {
      margin-bottom: 2rem;
      position: relative;
    }

    .day {
      font-size: 2.2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #3498db, #2ecc71);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.8rem;
      text-shadow: none;
      position: relative;
    }

    .date {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      letter-spacing: 1px;
    }

    .divider {
      width: 60%;
      height: 2px;
      background: linear-gradient(to right, 
        rgba(52, 152, 219, 0),
        rgba(52, 152, 219, 0.8),
        rgba(46, 204, 113, 0.8),
        rgba(46, 204, 113, 0)
      );
      margin: 2rem auto;
      position: relative;
    }

    .divider::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      background: #3498db;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 15px rgba(52, 152, 219, 0.8);
    }

    .time-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1rem;
      position: relative;
    }

    .time {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      letter-spacing: 1px;
      white-space: nowrap;
      width: 100%;
      text-align: center;
      position: relative;
    }

    .period {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      letter-spacing: 1px;
    }

    @media (max-width: 768px) {
      .clock-container {
        min-height: 250px;
        padding: 2rem;
      }

      .day {
        font-size: 1.8rem;
      }

      .date, .time, .period {
        font-size: 1rem;
      }
    }
  `]
})
export class DigitalClockComponent implements OnInit, OnDestroy {
  dayName: string = '';
  dateStr: string = '';
  timeStr: string = '';
  period: string = '';
  private intervalId?: number;

  private readonly days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  private readonly months = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  ngOnInit() {
    this.updateTime();
    this.intervalId = window.setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateTime() {
    const now = new Date();
    
    // Update day and date
    this.dayName = this.days[now.getDay()];
    this.dateStr = `${now.getDate()} ${this.months[now.getMonth()]} ${now.getFullYear()}`;
    
    // Update time
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    this.period = hours >= 12 ? 'مساءً' : 'صباحاً';
    hours = hours % 12 || 12;
    
    this.timeStr = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
