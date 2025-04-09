import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private pollSubscription: Subscription;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks(); 
    this.startPolling(); 
  }

  ngOnDestroy(): void {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe(); 
    }
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe((data) => (this.tasks = data));
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task._id !== id);
    });
  }

  toggleComplete(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTask(task).subscribe();
  }

  startPolling(): void {
    this.pollSubscription = interval(2000).subscribe(() => {
      this.fetchTasks(); 
    });
  }
}
