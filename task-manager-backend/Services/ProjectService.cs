using TaskManagerBackend.Models;
using TaskManagerBackend.Repositories;
using static TaskManagerBackend.Services.IProjectService;

namespace TaskManagerBackend.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _repository;

        public ProjectService(IProjectRepository repository)
        {
            _repository = repository;
        }

        public async Task<(IEnumerable<Project> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? name)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            return await _repository.GetPagedAsync(page, pageSize, name);
        }

        public async Task<Project?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Project> CreateAsync(Project project)
        {
            return await _repository.AddAsync(project);
        }

        public async Task<bool> UpdateAsync(int id, Project project)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing is null) return false;

            existing.Name = project.Name;
            existing.Description = project.Description;
            existing.StartDate = project.StartDate;
            existing.EndDate = project.EndDate;
            existing.Status = project.Status;

            await _repository.UpdateAsync(existing);
            return true;
        }

        public async Task<DeleteResult> DeleteAsync(int id)
        {
            var project = await _repository.GetByIdAsync(id);
            if (project is null) return DeleteResult.NotFound;

            if (await _repository.HasTasksAsync(id))
                return DeleteResult.HasTasks;

            await _repository.DeleteAsync(project);
            return DeleteResult.Success;

        }
    }
}
