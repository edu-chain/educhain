use anchor_lang::prelude::*;
use crate::state::course_data_account::CourseDataAccount;
use crate::state::school_data_account::SchoolDataAccount;

#[derive(Accounts)]
pub struct CreateCourse<'info> {
    #[account(
        mut,
        seeds = [
        b"school",
        signer.key().as_ref()
        ],
        bump
    )]
    pub school: Account<'info, SchoolDataAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + CourseDataAccount::INIT_SPACE,
        seeds = [
        b"course",
        school.key().as_ref(),
        &(school.courses_counter+1).to_le_bytes()
        ],
        bump
    )]
    pub course: Account<'info, CourseDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}
