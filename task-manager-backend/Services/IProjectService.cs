using TaskManagerBackend.Models;
namespace TaskManagerBackend.Services
{
    
        public interface IProjectService
        {
            Task<(IEnumerable<Project> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? name);
            Task<Project?> GetByIdAsync(int id);
            Task<Project> CreateAsync(Project project);
            Task<bool> UpdateAsync(int id, Project project);
            Task<DeleteResult> DeleteAsync(int id);
        }

        public enum DeleteResult
        {
            Success,
            NotFound,
            HasTasks
        }
    
}
