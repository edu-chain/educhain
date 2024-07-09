use anchor_lang::prelude::*;
use crate::state::course_data_account::CourseDataAccount;
use crate::state::group_data_account::GroupDataAccount;

#[derive(Accounts)]
pub struct CreateGroup<'info> {
    #[account(
        mut,
        seeds = [
        b"course",
        course.school.as_ref(),
        &course.id.to_le_bytes()
        ],
        bump
    )]
    pub course: Account<'info, CourseDataAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + GroupDataAccount::INIT_SPACE,
        seeds = [
        b"group",
        course.school.as_ref(),
        &course.id.to_le_bytes(),
        &(course.groups_counter+1).to_le_bytes()
        ],
        bump
    )]
    pub group: Account<'info, GroupDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}