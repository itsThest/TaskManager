using TaskManagerBackend.Models;


namespace TaskManagerBackend.Services
{
    public interface ITaskService
    {
        Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetPagedByProjectAsync(int projectId, int page, int pageSize);
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem?> CreateAsync(TaskItem task);
        Task<bool> UpdateAsync(int id, TaskItem task);
        Task<bool> DeleteAsync(int id);

    }
}
