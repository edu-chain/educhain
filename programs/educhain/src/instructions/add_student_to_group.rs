use anchor_lang::prelude::*;
use crate::state::course_data_account::CourseDataAccount;
use crate::state::group_data_account::GroupDataAccount;
use crate::state::student_subscription_data_account::StudentSubscriptionDataAccount;

#[derive(Accounts)]
pub struct AddStudentToGroup<'info> {
    #[account(
        seeds = [
        b"course",
        course.school.as_ref(),
        &course.id.to_le_bytes()
        ],
        bump
    )]
    pub course: Account<'info, CourseDataAccount>,

    #[account(
        mut,
        seeds = [
        b"subscription",
        course.key().as_ref(),
        subscription.student.as_ref(),
        ],
        bump
    )]
    pub subscription: Account<'info, StudentSubscriptionDataAccount>,

    #[account(
        mut,
        seeds = [
        b"group",
        course.school.as_ref(),
        &course.id.to_le_bytes(),
        &group.id.to_le_bytes()
        ],
        bump
    )]
    pub group: Account<'info, GroupDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
}