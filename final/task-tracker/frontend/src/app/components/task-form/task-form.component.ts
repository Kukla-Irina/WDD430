import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  title = '';

  constructor(private taskService: TaskService) {}

  addTask(): void {
    if (!this.title.trim()) return;
    const newTask: Task = { title: this.title, completed: false };
    this.taskService.addTask(newTask).subscribe(() => {
      this.title = '';
    });
  }
}