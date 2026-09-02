using TaskManagerBackend.Models;

namespace TaskManagerBackend.Repositories
{
    public interface IProjectRepository
    {
        Task<(IEnumerable<Project> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? name);
        Task<Project?> GetByIdAsync(int id);
        Task<Project> AddAsync(Project project);
        Task UpdateAsync(Project project);
        Task DeleteAsync(Project project);
        Task<bool> HasTasksAsync(int projectId);

    }
}
