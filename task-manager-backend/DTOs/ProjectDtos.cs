using TaskManagerBackend.Models;

namespace TaskManagerBackend.DTOs
{
    public record ProjectResponseDto(
      int Id,
      string Name,
      string? Description,
      DateTime StartDate,
      DateTime? EndDate,
      ProjectStatus Status);

    public record ProjectRequestDto(
        string Name,
        string? Description,
        DateTime StartDate,
        DateTime? EndDate,
        ProjectStatus Status);

    public record PagedResultDto<T>(
        IEnumerable<T> Items,
        int TotalCount,
        int Page,
        int PageSize);
}
