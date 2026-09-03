import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { ProjectListComponent } from './project-list.component';
import { ProjectStatus } from '../../../core/models/project.model';
import { environment } from '../../../../environments/environment';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debe cargar los proyectos y actualizar el total al iniciar', () => {
    fixture.detectChanges(); // dispara ngOnInit

    const req = httpMock.expectOne(
      r => r.url === `${environment.apiUrl}/projects`
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      items: [
        { id: 1, name: 'Proyecto A', description: null, startDate: '2026-09-01T00:00:00Z', endDate: null, status: ProjectStatus.Planned }
      ],
      totalCount: 1,
      page: 1,
      pageSize: 10
    });

    expect(component.projects.length).toBe(1);
    expect(component.totalCount).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('debe mostrar un mensaje de error si la petición falla', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(
      r => r.url === `${environment.apiUrl}/projects`
    );

    req.flush('error', { status: 500, statusText: 'Server Error' });

    expect(component.error).not.toBeNull();
    expect(component.loading).toBeFalse();
  });

  afterEach(() => {
    httpMock.verify(); // no deben quedar peticiones pendientes
  });
});