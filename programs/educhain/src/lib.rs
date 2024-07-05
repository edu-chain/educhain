use anchor_lang::prelude::*;
use std::vec::Vec;

const MAX_ADMINS_PER_COURSE: u8 = 10;
const MAX_STUDENTS_PER_GROUP: u8 = 3;

declare_id!("3WXZzDFmMAv6z69NQZNhV2YLMMWc7khQNRfyei2VCZmi");

#[program]
pub mod educhain {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
#[derive(InitSpace)]
pub struct SchoolDataAccount {
    pub owner: Pubkey,		// One School per wallet

    #[max_len(32)]
    pub name: String
}

#[account]
#[derive(InitSpace)]
pub struct CourseDataAccount {
   pub school: Pubkey,		// A course is linked to a school

   #[max_len(MAX_ADMINS_PER_COURSE)]
   pub admins: Vec<Pubkey>,	// Wallets allowed to administrate this course
}

#[account]
#[derive(InitSpace)]
pub struct SessionDataAccount {
   pub course: Pubkey,		// A session is linked to a course

   pub start: u64,		// Timestamp
   pub end: u64,		// Timestamp
}

#[account]
#[derive(InitSpace)]
pub struct GroupDataAccount {
   pub session: Pubkey,		// A group is linked to a session
   pub id: u64,			// Numeric identifier of the group

   #[max_len(MAX_STUDENTS_PER_GROUP)]
   pub students: Vec<Pubkey>
}

#[account]
#[derive(InitSpace)]
pub struct StudentSubscriptionDataAccount {
   // Note: A student can subscribe to multiple courses
   // One StudentSubscription Data-account per course subscription.

   pub course: Pubkey,		// A subscription is linked to a course

   pub active: bool 
} 

#[account]
#[derive(InitSpace)]
pub struct StudentAttendanceProofDataAccount {
   // Each time a student attends a session, he sign an attendance sheet.
   // This data-account represents an attendance sheet entry for one student and one session
   pub student: Pubkey,
   pub session: Pubkey
}

#[account]
#[derive(InitSpace)]
pub struct GroupSwapRequestDataAccount {
   pub course: Pubkey,
   pub student: Pubkey,
   pub group: Pubkey,		// Requested group
}
