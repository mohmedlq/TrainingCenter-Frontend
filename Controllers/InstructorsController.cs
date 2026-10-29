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
    [Route("api/InstructorsController")]
    [ApiController]
    public class InstructorsController : ControllerBase
    {
        #region Get Methods

        [HttpGet("GetAll", Name = "GetAllInstructors")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<InstructorDto>>> GetAllInstructors()
        {
            try
            {
                var instructors = await BusinessLayerInstructor.GetAllAsync();

                var result = instructors.Select(MapToViewInstouctor).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("{id}", Name = "GetInstructorById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<InstructorDto>> GetInstructorById(int id)
        {
            try
            {
                var instructor = await BusinessLayerInstructor.FindAsync(id);

                if (instructor == null)
                    return NotFound($"No instructor found with ID {id}.");

                return Ok(MapToViewInstouctor(instructor));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("email/{email}", Name = "GetInstructorByEmail")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<InstructorDto>> GetInstructorByEmail(string email)
        {
            try
            {
                var instructor = await BusinessLayerInstructor.FindByEmailAsync(email);

                if (instructor == null)
                    return NotFound($"No instructor found with email {email}.");

                   

                return Ok(MapToViewInstouctor(instructor));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("manager/{managerId}", Name = "GetInstructorsByManager")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<InstructorDto>>> GetInstructorsByManager(int managerId)
        {
            try
            {
                var instructors = await BusinessLayerInstructor.GetByManagerAsync(managerId);

                var result = instructors.Select(MapToViewInstouctor).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("active", Name = "GetActiveInstructors")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<InstructorDto>>> GetActiveInstructors()
        {
            try
            {
                var instructors = await BusinessLayerInstructor.GetActiveAsync();

                var result = instructors.Select(MapToViewInstouctor).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        #endregion

        #region Post & Put Methods

        [HttpPost("AddNew", Name = "AddNewInstructor")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CreateInstructorDto>> AddNewInstructor([FromBody] CreateInstructorDto instructorInfo)
        {
            if (instructorInfo == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                bool emailExists = await BusinessLayerInstructor.IsEmailExistsAsync(instructorInfo.Email);
                if (emailExists)
                    return Conflict($"An instructor with email '{instructorInfo.Email}' already exists.");

                var instructor = new BusinessLayerInstructor
                {
                    FirstName = instructorInfo.FirstName,
                    LastName = instructorInfo.LastName,
                    Email = instructorInfo.Email,
                    HireDate = instructorInfo.HireDate,
                    Salary = instructorInfo.Salary,
                    ManagerId = instructorInfo.ManagerId,
                    IsActive = instructorInfo.IsActive,
                    Password = instructorInfo.Password,
                    UserName = instructorInfo.UserName
                };

                bool isSaved = await instructor.SaveAsync();

                if (isSaved)
                {
                    var resultDto = MapToCreateInstouctor(instructor);

                    return CreatedAtRoute("GetInstructorById", new { id = instructor.InstructorId }, resultDto);
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save the instructor.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("{id}", Name = "UpdateInstructor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UpdateInstructorDto>> UpdateInstructor(int id, [FromBody] UpdateInstructorDto updatedInfo)
        {
            if (updatedInfo == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var instructor = await BusinessLayerInstructor.FindAsync(id);

                if (instructor == null)
                    return NotFound($"No instructor found with ID {id}.");

                if (instructor.Email.ToLower() != updatedInfo.Email.ToLower())
                {
                    bool emailExists = await BusinessLayerInstructor.IsEmailExistsAsync(updatedInfo.Email);
                    if (emailExists)
                        return Conflict($"The email '{updatedInfo.Email}' is already used by another instructor.");
                }

                instructor.FirstName = updatedInfo.FirstName;
                instructor.LastName = updatedInfo.LastName;
                instructor.Email = updatedInfo.Email;
                instructor.HireDate = updatedInfo.HireDate;
                instructor.Salary = updatedInfo.Salary;
                instructor.ManagerId = updatedInfo.ManagerId;
                instructor.IsActive = updatedInfo.IsActive;
                instructor.UserName= updatedInfo.UserName;

                bool isSaved = await instructor.SaveAsync();

                if (isSaved)
                {
                    var resultDto = MapToViewInstouctor(instructor);
                   

                    return Ok(resultDto);
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update the instructor.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }
        [HttpPut("{id}/Password", Name = "UpdateInstructorPassWord")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<InstructorDto>> UpdateInstructorPassword(int id, [FromBody] ChangeInstructorPasswordDto updatedInfo)
        {
            if (updatedInfo == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var instructor = await BusinessLayerInstructor.FindAsync(id);

                if (instructor == null)
                    return NotFound($"No instructor found with ID {id}.");
                bool isSaved = await instructor.ChangePasswordAsync(updatedInfo.NewPassword);

                if (isSaved)
                {
                    var resultDto = MapToViewInstouctor(instructor);


                    return NoContent();
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update the instructors Password.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }
        #endregion

        #region Delete Method

        [HttpDelete("{id}", Name = "DeleteInstructor")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteInstructor(int id)
        {
            try
            {
                var instructor = await BusinessLayerInstructor.FindAsync(id);
                if (instructor == null)
                    return NotFound($"No instructor found with ID {id}.");

                bool isDeleted = await instructor.DeleteAsync();

                if (isDeleted)
                    return Ok(new { Message = $"Instructor with ID {id} has been successfully deleted." });

                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete the instructor.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        #endregion


        #region Mapping Method
        private InstructorDto MapToViewInstouctor(BusinessLayerInstructor instructor)
        {
            return new InstructorDto
            {
                InstructorId = instructor.InstructorId,
                FirstName = instructor.FirstName,
                LastName = instructor.LastName,
                Email = instructor.Email,
                UserName = instructor.UserName
              
            };
        }
        private CreateInstructorDto MapToCreateInstouctor(BusinessLayerInstructor instructor)
        {
            return new CreateInstructorDto
            {
                FirstName = instructor.FirstName,
                LastName = instructor.LastName,
                Email = instructor.Email,
                HireDate = instructor.HireDate,
                Salary = instructor.Salary,
                ManagerId = instructor.ManagerId,
                IsActive = instructor.IsActive,
                Password = instructor.Password,
                UserName = instructor.UserName
            };
        }
        private UpdateInstructorDto MapToUpdateInstouctor(BusinessLayerInstructor instructor)
        {
            return new UpdateInstructorDto
            {
                FirstName = instructor.FirstName,
                LastName = instructor.LastName,
                Email = instructor.Email,
                HireDate = instructor.HireDate,
                Salary = instructor.Salary,
                ManagerId = instructor.ManagerId,
                IsActive = instructor.IsActive,
                UserName = instructor.UserName
            };
        }
        #endregion
    }
}