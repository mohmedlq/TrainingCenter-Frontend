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
    [Route("api/StudentsController")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        [HttpGet("GetAllStudents", Name = "AllStudents")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ViewStudentDTO>>> GetAllStudents()
        {
            try
            {
                var students = await BusinessLayerStudent.GetAllAsync();

                var result = students.Select(MapToViewStudentDTO).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpGet("GetStudentById/{id}", Name = "GetStudentById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ViewStudentDTO>> GetStudentById(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid Student ID.");

            try
            {
                var student = await BusinessLayerStudent.FindAsync(id);

                if (student == null)
                    return NotFound($"Student with ID: {id} was not found.");

                return Ok(MapToViewStudentDTO(student));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpGet("GetStudentByEmail/{email}", Name = "GetStudentByEmail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ViewStudentDTO>> GetStudentByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email cannot be empty.");

            try
            {
                var student = await BusinessLayerStudent.FindByEmailAsync(email);

                if (student == null)
                    return NotFound($"Student with Email: {email} was not found.");

                return Ok(MapToViewStudentDTO(student));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpGet("GetStudentsByStatus/{status}", Name = "GetStudentsByStatus")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ViewStudentDTO>>> GetStudentsByStatus(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                return BadRequest("Status cannot be empty.");

            try
            {
                var students = await BusinessLayerStudent.GetByStatusAsync(status);
                var result = students.Select(MapToViewStudentDTO).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpPost("AddNewStudent", Name = "NewStudent")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddNewStudent([FromBody] CreateStudentDTO newStudent)
        {

            try
            {
                bool emailExists = await BusinessLayerStudent.IsEmailExistsAsync(newStudent.Email);
                if (emailExists)
                {
                    return Conflict("Email is already registered.");
                }

                var student = new BusinessLayerStudent
                {
                    FirstName = newStudent.FirstName,
                    LastName = newStudent.LastName,
                    Email = newStudent.Email,
                    PhoneNumber = newStudent.PhoneNumber,
                    PasswordHash = newStudent.Password,
                    DateOfBirth = newStudent.DateOfBirth
                };

                bool isSaved = await student.SaveAsync();

                if (isSaved)
                {
                    return CreatedAtRoute("GetStudentById", new { id = student.StudentId }, new { student.StudentId });
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save student profile.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpPut("UpdateStudent/{id}", Name = "UpdateStudent")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> UpdateStudent(int id, [FromBody] UpdateStudentDTO updatedStudent)
        {
            if (id <= 0)
                return BadRequest("Invalid Student ID.");

            try
            {
                var student = await BusinessLayerStudent.FindAsync(id);

                if (student == null)
                    return NotFound($"Student with ID: {id} was not found.");

                student.FirstName = updatedStudent.FirstName;
                student.LastName = updatedStudent.LastName;
                student.Email = updatedStudent.Email;
                student.PhoneNumber = updatedStudent.PhoneNumber;
                student.DateOfBirth = updatedStudent.DateOfBirth;
                student.Status = updatedStudent.Status;

                bool isSaved = await student.SaveAsync();

                if (isSaved)
                    return Ok(new { Message = "Student updated successfully." });

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update student profile.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpPut("ChangePassword/{id}", Name = "ChangeStudentPassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ChangePassword(int id, [FromBody] ChangePasswordDTO passwordDto)
        {
            if (id <= 0)
                return BadRequest("Invalid Student ID.");

            try
            {
                var student = await BusinessLayerStudent.FindAsync(id);

                if (student == null)
                    return NotFound($"Student with ID: {id} was not found.");

                bool isChanged = await student.ChangePasswordAsync(passwordDto.NewPassword);

                if (isChanged)
                    return Ok(new { Message = "Password updated successfully." });

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update password.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        [HttpDelete("DeleteStudent/{id}", Name = "DeleteStudent")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteStudent(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid Student ID.");

            try
            {
                var student = await BusinessLayerStudent.FindAsync(id);

                if (student == null)
                    return NotFound($"Student with ID: {id} was not found.");

                bool isDeleted = await student.DeleteAsync();

                if (isDeleted)
                    return Ok(new { Message = "Student deleted successfully." });

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete student.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }

        private ViewStudentDTO MapToViewStudentDTO(BusinessLayerStudent student)
        {
            return new ViewStudentDTO
            {
                StudentId = student.StudentId,
                Status = student.Status,
                Email = student.Email,
                DateOfBirth = student.DateOfBirth,
                FullName = $"{student.FirstName} {student.LastName}"
            };
        }
    }
}