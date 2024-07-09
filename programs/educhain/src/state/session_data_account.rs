use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct SessionDataAccount {
    pub id: u64,			// Numeric identifier of the session in the course
    pub course: Pubkey,		// A session is linked to a course

    pub start: u64,		// Timestamp
    pub end: u64,		// Timestamp
}