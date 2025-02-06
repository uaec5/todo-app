import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DigitalClockComponent } from './shared/components/digital-clock/digital-clock.component';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        FormsModule,
        DigitalClockComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'todo-app' title`, () => {
    expect(component.title).toEqual('todo-app');
  });

  it('should render Todo App heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Todo App');
  });

  it('should add a new todo', () => {
    component.newTodo = 'Test Todo';
    component.addTodo();
    expect(component.todos.length).toBe(1);
    expect(component.todos[0].text).toBe('Test Todo');
    expect(component.newTodo).toBe('');
  });

  it('should not add empty todo', () => {
    component.newTodo = '';
    component.addTodo();
    expect(component.todos.length).toBe(0);
  });

  it('should remove todo', () => {
    component.newTodo = 'Test Todo';
    component.addTodo();
    expect(component.todos.length).toBe(1);
    
    component.removeTodo(0);
    expect(component.todos.length).toBe(0);
  });
});
