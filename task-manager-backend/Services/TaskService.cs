using TaskManagerBackend.Models;
using TaskManagerBackend.Repositories;

namespace TaskManagerBackend.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IProjectRepository _projectRepository;
        public TaskService(ITaskRepository taskRepository, IProjectRepository projectRepository)
        {
            _taskRepository = taskRepository;
            _projectRepository = projectRepository;
        }
        public async Task<(IEnumerable<TaskItem> Items, int TotalCount)> GetPagedByProjectAsync(int projectId, int page, int pageSize)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100;

            return await _taskRepository.GetPagedByProjectAsync(projectId, page, pageSize);
        }

        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _taskRepository.GetByIdAsync(id);
        }

        public async Task<TaskItem?> CreateAsync(TaskItem task)
        {
            var project = await _projectRepository.GetByIdAsync(task.ProjectId);
            if (project is null) return null;

            return await _taskRepository.AddAsync(task);
        }

        public async Task<bool> UpdateAsync(int id, TaskItem task)
        {
            var existing = await _taskRepository.GetByIdAsync(id);
            if (existing is null) return false;

            existing.Title = task.Title;
            existing.Description = task.Description;
            existing.Status = task.Status;
            existing.Priority = task.Priority;

            await _taskRepository.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _taskRepository.GetByIdAsync(id);
            if (existing is null) return false;

            await _taskRepository.DeleteAsync(existing);
            return true;
        }
    }
}
