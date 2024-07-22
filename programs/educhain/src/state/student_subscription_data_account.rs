use anchor_lang::prelude::*;
use crate::MAX_SKILLS_PER_STUDENT;

#[account]
#[derive(InitSpace)]
pub struct StudentSubscriptionDataAccount {
    // Note: A student can subscribe to multiple courses
    // One StudentSubscription Data-account per course subscription.

    pub course: Pubkey,		// A subscription is linked to a course
    pub student: Pubkey,		// and to a student.

    pub group: Option<Pubkey>,		// storage redundancy but no alternative: We need to know the group of this student in this structure.

    #[max_len(32)]
    pub name: String,		// Student can give different informations on his multiple subscriptions

    pub active: bool,

    pub availability: u8,

    #[max_len(MAX_SKILLS_PER_STUDENT, 100)]
    pub skills: Vec<String>,

    #[max_len(100)]
    pub interests: String,
}
