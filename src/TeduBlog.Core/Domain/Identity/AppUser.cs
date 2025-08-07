using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace TeduBlog.Core.Domain.Identity
{
    [Table("AppUsers")]
    public class AppUser : IdentityUser<Guid>   
    {
        [Required]
        [MaxLength(100)]
        public required string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public required string LastName { get; set; }
        public bool IsActive { get; set; } 
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExprixyTime { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? Dob { get; set; }
        [MaxLength(500)]
        public string? Avatar { get; set; }
        public DateTime? VipStartDate { get; set; }
        public DateTime? VipExpireEndDate { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public double Balance { get; set; }
    }
}
