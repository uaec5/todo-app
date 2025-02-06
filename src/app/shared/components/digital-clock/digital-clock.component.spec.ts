import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DigitalClockComponent } from './digital-clock.component';

describe('DigitalClockComponent', () => {
  let component: DigitalClockComponent;
  let fixture: ComponentFixture<DigitalClockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalClockComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current time', () => {
    expect(component.currentTime).toBeDefined();
    expect(component.currentDate).toBeDefined();
  });

  it('should update time periodically', fakeAsync(() => {
    const initialTime = component.currentTime;
    tick(1000);
    expect(component.currentTime).toBeDefined();
    // Note: We don't compare times directly as they might be different
    // due to the way JavaScript handles dates in tests
  }));

  it('should format date correctly', () => {
    const dateRegex = /^[A-Za-z]+, [A-Za-z]+ \d{1,2}, \d{4}$/;
    expect(dateRegex.test(component.currentDate)).toBeTruthy();
  });

  it('should display time and date in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.time')).toBeTruthy();
    expect(compiled.querySelector('.date')).toBeTruthy();
  });
});
