using Microsoft.AspNetCore.Mvc;
using TaskManagerBackend.DTOs;
using TaskManagerBackend.Models;
using TaskManagerBackend.Services;

namespace TaskManagerBackend.Controllers
{
    [ApiController]
    [Route("api")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _service;

        public TasksController(ITaskService service)
        {
            _service = service;
        }

        [HttpGet("projects/{projectId}/tasks")]
        public async Task<ActionResult<PagedResultDto<TaskResponseDto>>> GetByProject(
            int projectId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var (items, totalCount) = await _service.GetPagedByProjectAsync(projectId, page, pageSize);
            var dtos = items.Select(ToDto);
            return Ok(new PagedResultDto<TaskResponseDto>(dtos, totalCount, page, pageSize));
        }

        [HttpGet("tasks/{id}")]
        public async Task<ActionResult<TaskResponseDto>> GetById(int id)
        {
            var task = await _service.GetByIdAsync(id);
            if (task is null) return NotFound();
            return Ok(ToDto(task));
        }

        [HttpPost("tasks")]
        public async Task<ActionResult<TaskResponseDto>> Create([FromBody] TaskRequestDto dto)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                Priority = dto.Priority,
                ProjectId = dto.ProjectId
            };

            var created = await _service.CreateAsync(task);
            if (created is null)
                return NotFound(new { message = "El proyecto especificado no existe." });

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToDto(created));
        }

        [HttpPut("tasks/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TaskRequestDto dto)
        {
            var task = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                Priority = dto.Priority
            };

            var updated = await _service.UpdateAsync(id, task);
            if (!updated) return NotFound();
            return NoContent();
        }

        [HttpDelete("tasks/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
        private static TaskResponseDto ToDto(TaskItem t) =>
        new(t.Id, t.Title, t.Description, t.Status, t.Priority, t.CreatedAt, t.ProjectId);
    }

}
