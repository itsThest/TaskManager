import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectService } from './core/services/project.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<h1>Task Manager</h1>`,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private projectService = inject(ProjectService);

  ngOnInit(): void {
    this.projectService.getAll(1, 10).subscribe({
      next: (result) => console.log('OK:', result),
      error: (err) => console.error('ERROR:', err)
    });
  }
}