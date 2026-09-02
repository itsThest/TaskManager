using Microsoft.EntityFrameworkCore;
using TaskManagerBackend.Models;

namespace TaskManagerBackend.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects => Set<Project>();
        public DbSet<TaskItem> Tasks => Set<TaskItem>();
    }
}
