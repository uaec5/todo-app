import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';

declare var gapi: any;
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private readonly CLIENT_ID = ''; // Add your Google Client ID
  private readonly API_KEY = ''; // Add your Google API Key
  private readonly DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar';

  private tokenClient: any;
  private gapiInited = false;
  private gisInited = false;

  constructor(private http: HttpClient) {
    this.loadGoogleAPI();
  }

  private loadGoogleAPI() {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.onload = () => {
      gapi.load('client', this.initializeGapiClient.bind(this));
    };
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.onload = () => {
      this.initializeGisClient();
    };
    document.head.appendChild(script2);
  }

  private async initializeGapiClient() {
    await gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    });
    this.gapiInited = true;
  }

  private initializeGisClient() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '', // defined later
    });
    this.gisInited = true;
  }

  public async authenticate(): Promise<boolean> {
    if (!this.gapiInited || !this.gisInited) {
      console.warn('Google APIs not initialized');
      return false;
    }

    return new Promise((resolve) => {
      this.tokenClient.callback = async (resp: any) => {
        if (resp.error) {
          console.error('Authentication error:', resp);
          resolve(false);
          return;
        }
        resolve(true);
      };

      if (gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        this.tokenClient.requestAccessToken({ prompt: '' });
      }
    });
  }

  public async addTaskToCalendar(task: Task): Promise<boolean> {
    if (!this.gapiInited || !this.gisInited) {
      console.warn('Google APIs not initialized');
      return false;
    }

    try {
      // Extract duration from task title (e.g., "لمدة 30 دقيقة" or "خلال 15 دقيقة")
      const durationMatch = task.title.match(/(?:لمدة|خلال)\s+(\d+)\s+دق[يا]قة/);
      const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 30;

      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      const event = {
        summary: task.title,
        description: 'مهمة من تطبيق إدارة المهام',
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 5 }
          ]
        }
      };

      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      const response = await request.execute();
      console.log('Event created:', response);
      return true;
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      return false;
    }
  }

  public isAuthenticated(): boolean {
    return gapi.client.getToken() !== null;
  }
}
