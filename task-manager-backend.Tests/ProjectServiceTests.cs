using Moq;
using TaskManagerBackend.Models;
using TaskManagerBackend.Repositories;
using TaskManagerBackend.Services;

namespace task_manager_backend.Tests
{
    public class ProjectServiceTests
    {
        [Fact]
        public async Task DeleteAsync_ProyectoConTareas_DevuelveHasTasks()
        {
            // Arrange: se simula un repositorio donde el proyecto existe y tiene tareas
            var repository = new Mock<IProjectRepository>();
            repository.Setup(r => r.GetByIdAsync(1))
                      .ReturnsAsync(new Project { Id = 1, Name = "Proyecto con tareas" });
            repository.Setup(r => r.HasTasksAsync(1))
                      .ReturnsAsync(true);

            var service = new ProjectService(repository.Object);

            // Act
            var result = await service.DeleteAsync(1);

            // Assert: la regla de negocio impide el borrado
            Assert.Equal(DeleteResult.HasTasks, result);
            repository.Verify(r => r.DeleteAsync(It.IsAny<Project>()), Times.Never);
        }

        [Fact]
        public async Task DeleteAsync_ProyectoSinTareas_EliminaYDevuelveSuccess()
        {
            var repository = new Mock<IProjectRepository>();
            var project = new Project { Id = 2, Name = "Proyecto sin tareas" };

            repository.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(project);
            repository.Setup(r => r.HasTasksAsync(2)).ReturnsAsync(false);

            var service = new ProjectService(repository.Object);

            var result = await service.DeleteAsync(2);

            Assert.Equal(DeleteResult.Success, result);
            repository.Verify(r => r.DeleteAsync(project), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ProyectoInexistente_DevuelveNotFound()
        {
            var repository = new Mock<IProjectRepository>();
            repository.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Project?)null);

            var service = new ProjectService(repository.Object);

            var result = await service.DeleteAsync(99);

            Assert.Equal(DeleteResult.NotFound, result);
        }

        [Fact]
        public async Task GetPagedAsync_ParametrosInvalidos_SeCorrigenAValoresValidos()
        {
            var repository = new Mock<IProjectRepository>();
            repository.Setup(r => r.GetPagedAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string?>()))
                      .ReturnsAsync((new List<Project>(), 0));

            var service = new ProjectService(repository.Object);

            // page = 0 y pageSize = 500 son inválidos
            await service.GetPagedAsync(0, 500, null);

            // El service los corrige antes de llamar al repositorio
            repository.Verify(r => r.GetPagedAsync(1, 100, null), Times.Once);
        }
    }
}