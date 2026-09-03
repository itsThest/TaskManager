using Microsoft.AspNetCore.Mvc;
using TaskManagerBackend.DTOs;
using TaskManagerBackend.Models;
using TaskManagerBackend.Services;  

namespace TaskManagerBackend.Controllers
{
        [ApiController]
        [Route("api/[controller]")]
        public class ProjectsController : ControllerBase
        {
            private readonly IProjectService _service;

            public ProjectsController(IProjectService service)
            {
                _service = service;
            }

            [HttpGet]
            public async Task<ActionResult<PagedResultDto<ProjectResponseDto>>> GetAll(
                [FromQuery] int page = 1,
                [FromQuery] int pageSize = 10,
                [FromQuery] string? name = null)
            {
                var (items, totalCount) = await _service.GetPagedAsync(page, pageSize, name);
                var dtos = items.Select(ToDto);
                return Ok(new PagedResultDto<ProjectResponseDto>(dtos, totalCount, page, pageSize));
            }

            [HttpGet("{id}")]
            public async Task<ActionResult<ProjectResponseDto>> GetById(int id)
            {
                var project = await _service.GetByIdAsync(id);
                if (project is null) return NotFound();
                return Ok(ToDto(project));
            }

            [HttpPost]
            public async Task<ActionResult<ProjectResponseDto>> Create([FromBody] ProjectRequestDto dto)
            {
                var project = new Project
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    Status = dto.Status
                };

                var created = await _service.CreateAsync(project);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToDto(created));
            }

            [HttpPut("{id}")]
            public async Task<IActionResult> Update(int id, [FromBody] ProjectRequestDto dto)
            {
                var project = new Project
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    Status = dto.Status
                };

                var updated = await _service.UpdateAsync(id, project);
                if (!updated) return NotFound();
                return NoContent();
            }

            [HttpDelete("{id}")]
            public async Task<IActionResult> Delete(int id)
            {
                var result = await _service.DeleteAsync(id);

                return result switch
                {
                    DeleteResult.Success => NoContent(),
                    DeleteResult.NotFound => NotFound(),
                    DeleteResult.HasTasks => Conflict(new { message = "No se puede eliminar un proyecto que tiene tareas asociadas." }),
                    _ => StatusCode(500)
                };
            }

            private static ProjectResponseDto ToDto(Project p) =>
                new(p.Id, p.Name, p.Description, p.StartDate, p.EndDate, p.Status);
        }

    
}
