use anchor_lang::prelude::*;

#[error_code]
pub enum CustomErrors {
    #[msg("Exceeding maximum admins count")]
    ExceedingMaximumAdmins,

    #[msg("Exceeding maximum group members count")]
    ExceedingMaximumGroupMembers,

    #[msg("Exceeding maximum skills count")]
    ExceedingMaximumSkills,

    #[msg("Only a course admin can create a group")]
    OnlyCourseAdminCanCreateGroup,

    #[msg("Student is member of another group")]
    StudentIsMemberOfAnotherGroup,

    #[msg("Invalid student")]
    InvalidStudentConstraint,

    #[msg("Invalid group")]
    InvalidGroupConstraint,

    #[msg("Invalid course")]
    InvalidCourseConstraint,
}
