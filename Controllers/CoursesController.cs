using Business_Layer.Business_Logic;
using Business_Layer.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Training_Center.Controllers
{
    [Route("api/CoursesController")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        [HttpGet("GetAllCourses", Name = "AllCourses")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ViewCourseDTO>>> GetAllCourses()
        {
            try
            {
                var courses = await BusinessLayerCourse.GetAllAsync();
                var result = courses.Select(MapToViewCourse).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpGet("GetCourseById/{id}", Name = "GetCourseById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ViewCourseDTO>> GetCourseById(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid Course ID.");

            try
            {
                var course = await BusinessLayerCourse.FindAsync(id);

                if (course == null)
                    return NotFound($"Course with ID: {id} was not found.");

                return Ok(MapToViewCourse(course));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpGet("GetCourseByCode/{code}", Name = "GetCourseByCode")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ViewCourseDTO>> GetCourseByCode(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
                return BadRequest("Code cannot be empty.");

            try
            {
                var course = await BusinessLayerCourse.FindByCodeAsync(code);

                if (course == null)
                    return NotFound($"Course with Code: {code} was not found.");

                return Ok(MapToViewCourse(course));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpGet("GetCoursesByInstructor/{instructorId}", Name = "GetCoursesByInstructor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ViewCourseDTO>>> GetCoursesByInstructor(int instructorId)
        {
            if (instructorId <= 0)
                return BadRequest("Invalid Instructor ID.");

            try
            {
                var courses = await BusinessLayerCourse.GetByInstructorAsync(instructorId);
                var result = courses.Select(MapToViewCourse).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpGet("GetCoursesByStatus/{status}", Name = "GetCoursesByStatus")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ViewCourseDTO>>> GetCoursesByStatus(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                return BadRequest("Status cannot be empty.");

            try
            {
                var courses = await BusinessLayerCourse.GetByStatusAsync(status);
                var result = courses.Select(MapToViewCourse).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpPost("AddNewCourse", Name = "AddNewCourse")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddNewCourse([FromBody] CreateCourseDTO newCourse)
        {
            try
            {
                bool codeExists = await BusinessLayerCourse.IsCodeExistsAsync(newCourse.Code);
                if (codeExists)
                {
                    return Conflict("Course code already exists.");
                }

                var course = new BusinessLayerCourse
                {
                    Title = newCourse.Title,
                    Code = newCourse.Code,
                    Description = newCourse.Description,
                    Price = newCourse.Price,
                    Level = newCourse.Level,
                    DurationHours = newCourse.DurationHours,
                    Status = newCourse.Status,
                    InstructorId = newCourse.InstructorId
                };

                bool isSaved = await course.SaveAsync();

                if (isSaved)
                {
                    return CreatedAtRoute("GetCourseById", new { id = course.CourseId }, MapToViewCourse(course));
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save course.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
       
        

        [HttpPut("UpdateCourse/{id}", Name = "UpdateCourse")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> UpdateCourse(int id, [FromBody] UpdateCourseDTO updatedCourse)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid Course ID.");
            }

            try
            {
                var course = await BusinessLayerCourse.FindAsync(id);

                if (course == null)
                {
                    return NotFound($"Course with ID: {id} was not found.");
                }

                course.Title = updatedCourse.Title;
                course.Code = updatedCourse.Code;
                course.Description = updatedCourse.Description;
                course.Price = updatedCourse.Price;
                course.Level = updatedCourse.Level;
                course.DurationHours = updatedCourse.DurationHours;
                course.Status = updatedCourse.Status;
                course.PublishedAt = updatedCourse.PublishedAt;

                bool isSaved = await course.SaveAsync();

                if (isSaved)
                {
                    return Ok(new { Message = "Course updated successfully." });
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update course.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpDelete("DeleteCourse/{id}", Name = "DeleteCourse")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteCourse(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid Course ID.");
            }

            try
            {
                var course = await BusinessLayerCourse.FindAsync(id);

                if (course == null)
                {
                    return NotFound($"Course with ID: {id} was not found.");
                }

                bool isDeleted = await course.DeleteAsync();

                if (isDeleted)
                {
                    return Ok(new { Message = "Course deleted successfully." });
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete course.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        private ViewCourseDTO MapToViewCourse(BusinessLayerCourse course)
        {
            return new ViewCourseDTO
            {
                CourseId = course.CourseId,
                Title = course.Title,
                Code = course.Code,
                Description = course.Description,
                Price = course.Price,
                Level = course.Level,
                DurationHours = course.DurationHours,
                Status = course.Status,
                InstructorId = course.InstructorId,
                PublishedAt = course.PublishedAt
            };
        }
    }
}