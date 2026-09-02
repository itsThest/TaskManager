using TaskManagerBackend.Models;
using TaskManagerBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace TaskManagerBackend.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly AppDbContext _context;

        public ProjectRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<Project> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? name)
        {
            var query = _context.Projects.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(p => EF.Functions.ILike(p.Name, $"%{name}%"));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<Project?> GetByIdAsync(int id)
        {
            return await _context.Projects.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Project> AddAsync(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return project;
        }

        public async Task UpdateAsync(Project project)
        {
            _context.Projects.Update(project);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Project project)
        {
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> HasTasksAsync(int projectId)
        {
            return await _context.Tasks.AnyAsync(t => t.ProjectId == projectId);
        }
    }
}
