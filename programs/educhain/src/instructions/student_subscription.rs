use anchor_lang::prelude::*;
use crate::state::school_data_account::SchoolDataAccount;
use crate::state::course_data_account::CourseDataAccount;
use crate::state::student_subscription_data_account::StudentSubscriptionDataAccount;

#[derive(Accounts)]
pub struct StudentSubscription<'info> {
    // We need school account because it will receive funds from student when subscribing
    #[account(
        mut,
        seeds = [
        b"school",
        course.school_owner.as_ref()
        ],
        bump
    )]
    pub school: Account<'info, SchoolDataAccount>,

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
        init,
        payer = signer,
        space = 8 + StudentSubscriptionDataAccount::INIT_SPACE,
        seeds = [
        b"subscription",
        course.key().as_ref(),
        signer.key().as_ref(),
        ],
        bump
    )]
    pub subscription: Account<'info, StudentSubscriptionDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}
