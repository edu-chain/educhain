use anchor_lang::prelude::*;
use crate::MAX_STUDENTS_PER_GROUP;

#[account]
#[derive(InitSpace)]
pub struct GroupDataAccount {
    pub id: u64,			// Numeric identifier of the group in th course
    pub course: Pubkey,		// A group is linked to a course

    #[max_len(MAX_STUDENTS_PER_GROUP)]
    pub students: Vec<Pubkey>
}