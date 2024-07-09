use anchor_lang::prelude::*;
use crate::state::course_data_account::CourseDataAccount;
use crate::state::student_subscription_data_account::StudentSubscriptionDataAccount;
use crate::state::group_data_account::GroupDataAccount;
use crate::state::group_swap_request_data_account::GroupSwapRequestDataAccount;

#[derive(Accounts)]
pub struct GroupSwapRequest<'info> {
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
        seeds = [
        b"subscription",
        course.key().as_ref(),
        subscription.student.as_ref(),
        ],
        bump
    )]
    pub subscription: Account<'info, StudentSubscriptionDataAccount>,

    #[account(
        seeds = [
        b"group",
        course.school.as_ref(),
        &course.id.to_le_bytes(),
        &requested_group.id.to_le_bytes()
        ],
        bump
    )]
    pub requested_group: Account<'info, GroupDataAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + GroupSwapRequestDataAccount::INIT_SPACE,
        seeds = [
        b"swap_request",
        subscription.course.as_ref(),
        subscription.key().as_ref(),
        signer.key().as_ref(),
        ],
        bump
    )]
    pub swap_request: Account<'info, GroupSwapRequestDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}