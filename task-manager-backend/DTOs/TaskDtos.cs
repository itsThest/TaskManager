using TaskManagerBackend.Models;

namespace TaskManagerBackend.DTOs
{
    public record TaskResponseDto(
    int Id,
    string Title,
    string? Description,
    TaskItemStatus Status,
    TaskPriority Priority,
    DateTime CreatedAt,
    int ProjectId);

    public record TaskRequestDto(
        string Title,
        string? Description,
        TaskItemStatus Status,
        TaskPriority Priority,
        int ProjectId);
}
