use anchor_lang::prelude::*;
use crate::state::course_data_account::CourseDataAccount;
use crate::state::student_subscription_data_account::StudentSubscriptionDataAccount;
use crate::state::session_data_account::SessionDataAccount;
use crate::state::student_attendance_proof_data_account::StudentAttendanceProofDataAccount;

#[derive(Accounts)]
pub struct StudentAttendance<'info> {
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
        subscription.course.as_ref(),
        signer.key().as_ref(),
        ],
        bump
    )]
    pub subscription: Account<'info, StudentSubscriptionDataAccount>,

    #[account(
        seeds = [
        b"session",
        course.school.as_ref(),
        &course.id.to_le_bytes(),
        &session.id.to_le_bytes(),
        ],
        bump
    )]
    pub session: Account<'info, SessionDataAccount>,

    #[account(
        init,
        payer = signer,
        space = 8 + StudentAttendanceProofDataAccount::INIT_SPACE,
        seeds = [
        b"attendance",
        session.key().as_ref(),
        signer.key().as_ref(),
        ],
        bump
    )]
    pub attendance: Account<'info, StudentAttendanceProofDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}
