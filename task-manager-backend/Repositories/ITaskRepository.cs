using TaskManagerBackend.Models;
namespace TaskManagerBackend.Repositories
{
    public interface ITaskRepository
    {
        Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetPagedByProjectAsync(int projectId, int page, int pageSize);
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem> AddAsync(TaskItem task);
        Task UpdateAsync(TaskItem task);
        Task DeleteAsync(TaskItem task);

    }
}
