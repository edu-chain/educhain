use anchor_lang::prelude::*;
use crate::state::school_data_account::SchoolDataAccount;
use crate::state::course_data_account::CourseDataAccount;
use crate::state::session_data_account::SessionDataAccount;

#[derive(Accounts)]
pub struct CreateSession<'info> {
    #[account(
        seeds = [
        b"school",
        signer.key().as_ref()
        ],
        bump
    )]
    pub school: Account<'info, SchoolDataAccount>,

    #[account(
        mut,
        seeds = [
        b"course",
        school.key().as_ref(),
        &course.id.to_le_bytes()
        ],
        bump
    )]
    pub course: Account<'info, CourseDataAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + SessionDataAccount::INIT_SPACE,
        seeds = [
        b"session",
        school.key().as_ref(),
        &course.id.to_le_bytes(),
        &(course.sessions_counter+1).to_le_bytes()
        ],
        bump
    )]
    pub session: Account<'info, SessionDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}
