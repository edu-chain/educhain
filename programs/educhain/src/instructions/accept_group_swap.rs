use anchor_lang::prelude::*;
use crate::state::course_data_account::CourseDataAccount;
use crate::state::group_swap_request_data_account::GroupSwapRequestDataAccount;
use crate::state::group_data_account::GroupDataAccount;

#[derive(Accounts)]
pub struct AcceptGroupSwap<'info> {
    #[account(
        seeds = [
        b"course",
        course.school.as_ref(),
        &course.id.to_le_bytes()
        ],
        bump
    )]
    pub course: Account<'info, CourseDataAccount>,

    // close account when request is accepted
    #[account(
        mut,
        close = signer, // <- TODO: Wrong dest
        seeds = [
        b"swap_request",
        course.key().as_ref(),
        swap_request.subscription.as_ref(),
        swap_request.student.as_ref()
        ],
        bump
    )]
    pub swap_request: Account<'info, GroupSwapRequestDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        seeds = [
        b"group",
        course.school.as_ref(),
        &course.id.to_le_bytes(),
        &signer_group.id.to_le_bytes()
        ],
        bump
    )]
    pub signer_group: Account<'info, GroupDataAccount>,

    // TODO: Constraint: signer_group should be the same than swap_request.requested_group

    pub system_program: Program<'info, System>
}
