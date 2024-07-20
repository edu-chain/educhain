use anchor_lang::prelude::*;
use crate::state::course_data_account::CourseDataAccount;
use crate::state::student_subscription_data_account::StudentSubscriptionDataAccount;
use crate::state::group_swap_request_data_account::GroupSwapRequestDataAccount;
use crate::state::group_data_account::GroupDataAccount;
use crate::custom_errors::CustomErrors;

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

    #[account(mut)]
    pub requesting_student: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [
        b"subscription",
        course.key().as_ref(),
        swap_request.student.as_ref(),
        ],
        bump,
//        constraint = requesting_student_subscription.student == requesting_student.key() @ CustomErrors::InvalidStudent
    )]
    pub requesting_student_subscription: Account<'info, StudentSubscriptionDataAccount>,

    #[account(
        mut,
        seeds = [
        b"group",
        course.school.as_ref(),
        &course.id.to_le_bytes(),
        &requesting_student_group.id.to_le_bytes()
        ],
        bump,
    )]
    pub requesting_student_group: Account<'info, GroupDataAccount>,

    // close this data-account when request is accepted
    #[account(
        mut,
        close = requesting_student,	// refund data-account rent to the student who made the request
        seeds = [
        b"swap_request",
        course.key().as_ref(),
        swap_request.subscription.as_ref(),
        swap_request.student.as_ref()
        ],
        bump,
        // constraint = swap_request.student == requesting_student.key() @ CustomErrors::InvalidStudent
    )]
    pub swap_request: Account<'info, GroupSwapRequestDataAccount>,
   

    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [
        b"subscription",
        course.key().as_ref(),
        signer.key().as_ref(),
        ],
        bump,
    )]
    pub signer_subscription: Account<'info, StudentSubscriptionDataAccount>,

    #[account(
        mut,
        seeds = [
        b"group",
        course.school.as_ref(),
        &course.id.to_le_bytes(),
        &signer_group.id.to_le_bytes()
        ],
        bump,
        // constraint = swap_request.requested_group == signer_group.key() @ CustomErrors::InvalidGroup
    )]
    pub signer_group: Account<'info, GroupDataAccount>,

    // TODO: Constraint: signer_group should be the same than swap_request.requested_group

    pub system_program: Program<'info, System>
}
