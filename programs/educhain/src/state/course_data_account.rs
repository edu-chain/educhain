use anchor_lang::prelude::*;
use std::vec::Vec;
use crate::MAX_ADMINS_PER_COURSE;

#[account]
#[derive(InitSpace)]
pub struct CourseDataAccount {
    pub id: u64,		// Numeric identifier of the course in the school
    pub school: Pubkey,		// A course is linked to a school

    pub school_owner: Pubkey,	// storage redundancy... but necessary

    #[max_len(32)]
    pub name: String,

    #[max_len(MAX_ADMINS_PER_COURSE)]
    pub admins: Vec<Pubkey>,	// Wallets allowed to administrate this course

    pub sessions_counter: u64,
    pub groups_counter: u64
}
