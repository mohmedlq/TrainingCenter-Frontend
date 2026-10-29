using Business_Layer.Business_Logic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Business_Layer.DTOs;

namespace Training_Center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentsController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<EnrollmentReadDto>>> GetAllEnrollments()
        {
            var enrollments = await BusinessLayerEnrollments.GetAllAsync();

            if (enrollments == null || !enrollments.Any())
            {
                return NotFound("No enrollments found.");
            }

            var enrollmentsDto = enrollments.Select(MapToReadDto).ToList();
            return Ok(enrollmentsDto);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<EnrollmentReadDto>> GetEnrollmentById(int id)
        {
            var enrollment = await BusinessLayerEnrollments.FindAsync(id);

            if (enrollment == null)
            {
                return NotFound($"Enrollment with ID {id} not found.");
            }

            return Ok(MapToReadDto(enrollment));
        }

        [HttpGet("student/{studentId:int}")]
        public async Task<ActionResult<IEnumerable<EnrollmentReadDto>>> GetEnrollmentsByStudent(int studentId)
        {
            var enrollments = await BusinessLayerEnrollments.GetByStudentAsync(studentId);

            if (enrollments == null || !enrollments.Any())
            {
                return NotFound($"No enrollments found for student ID {studentId}.");
            }

            return Ok(enrollments.Select(MapToReadDto));
        }

        [HttpGet("course/{courseId:int}")]
        public async Task<ActionResult<IEnumerable<EnrollmentReadDto>>> GetEnrollmentsByCourse(int courseId)
        {
            var enrollments = await BusinessLayerEnrollments.GetByCourseAsync(courseId);

            if (enrollments == null || !enrollments.Any())
            {
                return NotFound($"No enrollments found for course ID {courseId}.");
            }

            return Ok(enrollments.Select(MapToReadDto));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<EnrollmentCreateDto>> CreateEnrollment([FromBody] EnrollmentCreateDto createDto)
        {
            if (createDto == null)
            {
                return BadRequest("Invalid enrollment data.");
            }

            bool isEnrolled = await BusinessLayerEnrollments.IsStudentEnrolledAsync(createDto.StudentId, createDto.CourseId);
            if (isEnrolled)
            {
                return BadRequest("Student is already enrolled in this course.");
            }

            var newEnrollment = new BusinessLayerEnrollments
            {
                StudentId = createDto.StudentId,
                CourseId = createDto.CourseId
            };

            bool isSaved = await newEnrollment.SaveAsync();

            if (!isSaved)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the enrollment.");
            }

            var readDto = MapToReadDto(newEnrollment);

            return CreatedAtAction(nameof(GetEnrollmentById), new { id = readDto.EnrollmentId }, readDto);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> UpdateEnrollment(int id, [FromBody] EnrollmentUpdateDto updateDto)
        {
            if (updateDto == null)
            {
                return BadRequest("Invalid update data.");
            }

            var existingEnrollment = await BusinessLayerEnrollments.FindAsync(id);

            if (existingEnrollment == null)
            {
                return NotFound($"Enrollment with ID {id} not found.");
            }

            existingEnrollment.ProgressPercent = updateDto.ProgressPercent;
            existingEnrollment.FinalGrade = updateDto.FinalGrade;
            existingEnrollment.CompletionDate = updateDto.CompletionDate;

            if (!string.IsNullOrWhiteSpace(updateDto.Status))
            {
                existingEnrollment.Status = updateDto.Status;
            }

            bool isUpdated = await existingEnrollment.SaveAsync();

            if (!isUpdated)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the enrollment.");
            }

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteEnrollment(int id)
        {
            var existingEnrollment = await BusinessLayerEnrollments.FindAsync(id);

            if (existingEnrollment == null)
            {
                return NotFound($"Enrollment with ID {id} not found.");
            }

            bool isDeleted = await existingEnrollment.DeleteAsync();

            if (!isDeleted)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the enrollment.");
            }

            return NoContent();
        }

        private static EnrollmentReadDto MapToReadDto(BusinessLayerEnrollments blEnrollment)
        {
            return new EnrollmentReadDto
            {
                EnrollmentId = blEnrollment.EnrollmentId,
                StudentId = blEnrollment.StudentId,
                CourseId = blEnrollment.CourseId,
                EnrollmentDate = blEnrollment.EnrollmentDate,
                ProgressPercent = blEnrollment.ProgressPercent,
                FinalGrade = blEnrollment.FinalGrade,
                CompletionDate = blEnrollment.CompletionDate,
                Status = blEnrollment.Status
            };
        }
    }
}