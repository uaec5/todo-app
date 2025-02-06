import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-digital-clock',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="clock-card">
      <mat-card-content class="clock-display">
        <div class="time">{{hours}}:{{minutes}}:{{seconds}}</div>
        <div class="date">{{date}}</div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .clock-card {
      background: linear-gradient(45deg, #2c3e50, #3498db);
      color: white;
      border-radius: 10px;
      overflow: hidden;
      width: 300px;
      margin: 1rem auto;
    }

    .clock-display {
      padding: 1rem;
      text-align: center;
    }

    .time {
      font-size: 2.5rem;
      font-weight: 700;
      font-family: 'Digital', monospace;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      margin-bottom: 0.5rem;
    }

    .date {
      font-size: 1rem;
      opacity: 0.8;
    }

    @media (max-width: 400px) {
      .clock-card {
        width: 90%;
      }
      
      .time {
        font-size: 2rem;
      }
    }
  `]
})
export class DigitalClockComponent implements OnInit, OnDestroy {
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';
  date: string = '';
  private subscription: Subscription | undefined;

  ngOnInit() {
    this.updateTime();
    this.subscription = interval(1000).subscribe(() => {
      this.updateTime();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateTime() {
    const now = new Date();
    this.hours = this.padNumber(now.getHours());
    this.minutes = this.padNumber(now.getMinutes());
    this.seconds = this.padNumber(now.getSeconds());
    this.date = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}
