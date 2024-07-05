use anchor_lang::prelude::*;
use std::vec::Vec;

const MAX_ADMINS_PER_COURSE: u8 = 10;
const MAX_STUDENTS_PER_GROUP: u8 = 3;

declare_id!("3WXZzDFmMAv6z69NQZNhV2YLMMWc7khQNRfyei2VCZmi");

#[program]
pub mod educhain {
    use super::*;

    pub fn initialize_school(ctx: Context<InitializeSchool>, name: String) -> Result<()> {
        ctx.accounts.school.owner = ctx.accounts.signer.key();
        ctx.accounts.school.name = name;
        ctx.accounts.school.courses_counter = 0;

        Ok(())
    }

    pub fn create_course(ctx: Context<CreateCourse>, name: String) -> Result<()> {
        ctx.accounts.school.courses_counter += 1;

        ctx.accounts.course.id = ctx.accounts.school.courses_counter; 
        ctx.accounts.course.name = name;
        ctx.accounts.course.school = ctx.accounts.school.key();
        // ctx.accounts.course.admins = TODO
        ctx.accounts.course.sessions_counter = 0;

        Ok(())
    }

    pub fn create_session(ctx: Context<CreateSession>, start: u64, end: u64) -> Result<()> {
        ctx.accounts.course.sessions_counter += 1;

        ctx.accounts.session.id = ctx.accounts.course.sessions_counter;
        ctx.accounts.session.course = ctx.accounts.course.key();
        ctx.accounts.session.start = start;
        ctx.accounts.session.start = end;

        Ok(())
    }

    pub fn create_group(ctx: Context<CreateGroup>, students: Vec<Pubkey>) -> Result<()> {
        ctx.accounts.course.groups_counter += 1;

        ctx.accounts.group.id = ctx.accounts.course.groups_counter;
        ctx.accounts.group.course = ctx.accounts.course.key();
        // TODO ctx.students = students;

        Ok(())
    }
}

/* Instructions */

#[derive(Accounts)]
pub struct InitializeSchool<'info> {
   #[account(
        init,
        payer = signer,
        space = 8 + SchoolDataAccount::INIT_SPACE,
        seeds = [
	  // One school par wallet
          b"school", 
          signer.key().as_ref()
        ],
        bump
    )]
    pub school: Account<'info, SchoolDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CreateCourse<'info> {
   #[account(
        mut,
        seeds = [
          b"school", 
          signer.key().as_ref()
        ],
        bump
    )]
    pub school: Account<'info, SchoolDataAccount>,

   #[account(
        init,
        payer = signer,
        space = 8 + CourseDataAccount::INIT_SPACE,
        seeds = [
          b"course", 
          school.key().as_ref(), 
          &(school.courses_counter+1).to_le_bytes()
        ],
        bump
    )]
    pub course: Account<'info, CourseDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CreateSession<'info> {
   #[account(
        seeds = [
          b"school", 
          signer.key().as_ref()
        ],
        bump
    )]
    pub school: Account<'info, SchoolDataAccount>,

    #[account(
        mut,
        seeds = [
          b"course", 
          school.key().as_ref(), 
          &course.id.to_le_bytes()
        ],
        bump
    )]
    pub course: Account<'info, CourseDataAccount>,

   #[account(
        init,
        payer = signer,
        space = 8 + SessionDataAccount::INIT_SPACE,
        seeds = [
          b"session", 
          school.key().as_ref(), 
          &course.id.to_le_bytes(), 
          &(course.sessions_counter+1).to_le_bytes()
        ],
        bump
    )]
    pub session: Account<'info, SessionDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CreateGroup<'info> {
   #[account(
        seeds = [
          b"school", 
          signer.key().as_ref()
        ],
        bump
    )]
    pub school: Account<'info, SchoolDataAccount>,

    #[account(
        mut,
        seeds = [
          b"course", 
          school.key().as_ref(), 
          &course.id.to_le_bytes()
        ],
        bump
    )]
    pub course: Account<'info, CourseDataAccount>,

   #[account(
        init,
        payer = signer,
        space = 8 + CourseDataAccount::INIT_SPACE,
        seeds = [
          b"group", 
          school.key().as_ref(), 
          &course.id.to_le_bytes(), 
          &(course.groups_counter+1).to_le_bytes()
        ],
        bump
    )]
    pub group: Account<'info, GroupDataAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}

/* Data Accounts */

#[account]
#[derive(InitSpace)]
pub struct SchoolDataAccount {
    pub owner: Pubkey,		// One School per wallet

    #[max_len(32)]
    pub name: String,

    pub courses_counter: u64
}

#[account]
#[derive(InitSpace)]
pub struct CourseDataAccount {
    pub id: u64,		// Numeric identifier of the course in the school
    pub school: Pubkey,		// A course is linked to a school

    #[max_len(32)]
    pub name: String,

    #[max_len(MAX_ADMINS_PER_COURSE)]
    pub admins: Vec<Pubkey>,	// Wallets allowed to administrate this course

    pub sessions_counter: u64,
    pub groups_counter: u64
}

#[account]
#[derive(InitSpace)]
pub struct SessionDataAccount {
   pub id: u64,			// Numeric identifier of the session in the course
   pub course: Pubkey,		// A session is linked to a course

   pub start: u64,		// Timestamp
   pub end: u64,		// Timestamp
}

#[account]
#[derive(InitSpace)]
pub struct GroupDataAccount {
   pub id: u64,			// Numeric identifier of the group in th course
   pub course: Pubkey,		// A group is linked to a course

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
