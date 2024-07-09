use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct StudentAttendanceProofDataAccount {
    // Each time a student attends a session, he sign an attendance sheet.
    // This data-account represents an attendance sheet entry for one student and one session
    pub student: Pubkey,
    pub session: Pubkey
}