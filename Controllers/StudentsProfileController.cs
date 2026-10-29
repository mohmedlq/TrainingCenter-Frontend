using Business_Layer.Business_Logic;
using Business_Layer.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Training_Center.Controllers
{
    [Route("api/StudentsProfileController")]
    [ApiController]
    public class StudentsProfileController : ControllerBase
    {
        [HttpGet("GetAllProfiles", Name = "AllStudentsProfiles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<StudentProfileDto>>> GetAllStudentsProfiles()
        {
            try
            {
                var profiles = await BusinessLayerStudentProfile.GetAllAsync();
                var result = profiles.Select(MapToDto).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("{studentId}", Name = "GetStudentProfileById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<StudentProfileDto>> GetStudentProfileById(int studentId)
        {
            try
            {
                var profile = await BusinessLayerStudentProfile.FindAsync(studentId);

                if (profile == null)
                    return NotFound($"No profile found for Student ID {studentId}.");

                return Ok(MapToDto(profile));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("city/{city}", Name = "GetProfilesByCity")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<StudentProfileDto>>> GetProfilesByCity(string city)
        {
            try
            {
                var profiles = await BusinessLayerStudentProfile.GetByCityAsync(city);
                var result = profiles.Select(MapToDto).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("country/{country}", Name = "GetProfilesByCountry")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<StudentProfileDto>>> GetProfilesByCountry(string country)
        {
            try
            {
                var profiles = await BusinessLayerStudentProfile.GetByCountryAsync(country);
                var result = profiles.Select(MapToDto).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPost("AddNewStudentProfile", Name = "NewStudentProfile")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CreateStudentProfileDto>> AddNewStudentProfile([FromBody] CreateStudentProfileDto profileInfo)
        {
            if (profileInfo == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                bool exists = await BusinessLayerStudentProfile.IsExistsAsync(profileInfo.StudentId);
                if (exists)
                    return Conflict($"Student with ID {profileInfo.StudentId} already has a profile.");

                var profile = new BusinessLayerStudentProfile
                {
                    StudentId = profileInfo.StudentId,
                    Address = profileInfo.Address,
                    City = profileInfo.City,
                    Country = profileInfo.Country,
                    Bio = profileInfo.Bio,
                    LinkedInUrl = profileInfo.LinkedInUrl
                };

                bool isSaved = await profile.SaveAsync();

                if (isSaved)
                {
                    return CreatedAtRoute("GetStudentProfileById", new { studentId = profile.StudentId }, MapToCreateDto(profile));
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while saving the profile.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPut("{studentId}", Name = "UpdateStudentProfile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UpdateStudentProfileDto>> UpdateStudentProfile(int studentId, [FromBody] UpdateStudentProfileDto updatedInfo)
        {
            if (updatedInfo == null || !ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var profile = await BusinessLayerStudentProfile.FindAsync(studentId);

                if (profile == null)
                    return NotFound($"No profile found for Student ID {studentId}.");

                profile.Address = updatedInfo.Address;
                profile.City = updatedInfo.City;
                profile.Country = updatedInfo.Country;
                profile.Bio = updatedInfo.Bio;
                profile.LinkedInUrl = updatedInfo.LinkedInUrl;

                bool isSaved = await profile.SaveAsync();

                if (isSaved)
                {
                    return Ok(MapToUpdateDto(profile));
                }

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the profile.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpDelete("{studentId}", Name = "DeleteStudentProfile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteStudentProfile(int studentId)
        {
            try
            {
                bool exists = await BusinessLayerStudentProfile.IsExistsAsync(studentId);
                if (!exists)
                    return NotFound($"No profile found for Student ID {studentId}.");

                var profile = new BusinessLayerStudentProfile { StudentId = studentId };
                bool isDeleted = await profile.DeleteAsync();

                if (isDeleted)
                    return Ok(new { Message = $"Profile for Student ID {studentId} has been successfully deleted." });

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the profile.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpGet("{studentId}/IsExists", Name = "IsProfileExist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> IsProfileExist(int studentId)
        {
            try
            {
                bool exists = await BusinessLayerStudentProfile.IsExistsAsync(studentId);
                if (!exists)
                    return NotFound($"No profile found for Student ID {studentId}.");
                var profile= await BusinessLayerStudentProfile.FindAsync(studentId);
                return Ok(MapToUpdateDto(profile));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        private static StudentProfileDto MapToDto(BusinessLayerStudentProfile profile)
        {
            if (profile == null) return null;

            return new StudentProfileDto
            {
                StudentId = profile.StudentId,
                Address = profile.Address,
                City = profile.City,
                Country = profile.Country,
                Bio = profile.Bio,
                LinkedInUrl = profile.LinkedInUrl
            };
        }

        private static CreateStudentProfileDto MapToCreateDto(BusinessLayerStudentProfile profile)
        {
            if (profile == null) return null;

            return new CreateStudentProfileDto
            {
                StudentId = profile.StudentId,
                Address = profile.Address,
                City = profile.City,
                Country = profile.Country,
                Bio = profile.Bio,
                LinkedInUrl = profile.LinkedInUrl
            };
        }

        private static UpdateStudentProfileDto MapToUpdateDto(BusinessLayerStudentProfile profile)
        {
            if (profile == null) return null;

            return new UpdateStudentProfileDto
            {
                Address = profile.Address,
                City = profile.City,
                Country = profile.Country,
                Bio = profile.Bio,
                LinkedInUrl = profile.LinkedInUrl
            };
        }
    }
}