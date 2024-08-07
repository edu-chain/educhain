use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use anchor_lang::system_program;
use std::vec::Vec;
use anchor_lang::AnchorSerialize;
use anchor_lang::AnchorDeserialize;

mod state;	// import ./state/mod.rs (or ./state.rs)
// use state::group_swap_request_data_account::GroupSwapRequestDataAccount; 	// using ./state/group_swap_request_data_account.rs:GroupSwapRequestDataAccount

mod config;
use config::*;

mod custom_errors;                      // import ./custom_errors.rs file (or ./custom_errors/mod.rs file)
use custom_errors::CustomErrors;        // use custom_errors.rs:CustomErrors

pub mod instructions;   // import ./instructions/mod.rs (or ./instructions.rs)
// "use" statements are in ./instructions/mod.rs
use instructions::*;

declare_id!("BMuxBtE1aJ8dJdjjXybV81iYUiR4ribMuc6HALfEYSBH");

#[program]
pub mod educhain {
    use super::*;

    pub fn initialize_school(ctx: Context<InitializeSchool>, name: String) -> Result<()> {
        ctx.accounts.school.owner = ctx.accounts.signer.key();
        ctx.accounts.school.name = name;
        ctx.accounts.school.courses_counter = 0;

        Ok(())
    }

    pub fn create_course(ctx: Context<CreateCourse>, name: String, course_admins: Vec<Pubkey>) -> Result<()> {
        require!(course_admins.len()<=MAX_ADMINS_PER_COURSE, CustomErrors::ExceedingMaximumAdmins);

        ctx.accounts.school.courses_counter += 1;

        ctx.accounts.course.id = ctx.accounts.school.courses_counter; 
        ctx.accounts.course.name = name;
        ctx.accounts.course.school = ctx.accounts.school.key();
        ctx.accounts.course.school_owner = ctx.accounts.signer.key();
        ctx.accounts.course.admins = course_admins;
        ctx.accounts.course.sessions_counter = 0;

        Ok(())
    }

    pub fn create_session(ctx: Context<CreateSession>, start: u64, end: u64) -> Result<()> {
        ctx.accounts.course.sessions_counter += 1;

        ctx.accounts.session.id = ctx.accounts.course.sessions_counter;
        ctx.accounts.session.course = ctx.accounts.course.key();
        ctx.accounts.session.start = start;
        ctx.accounts.session.end = end;

        Ok(())
    }

    pub fn student_subscription(ctx: Context<StudentSubscription>, name: String, availability: u8, skills: Vec<String>, interests: String) -> Result<()> {
        require!(skills.len()<=MAX_SKILLS_PER_STUDENT, CustomErrors::ExceedingMaximumSkills);

        // Student must pay his subscription (3 SOL per course). So this instruction is "payable"
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.signer.to_account_info(),
                    to: ctx.accounts.school.to_account_info(),
                },
            ),
            3 * LAMPORTS_PER_SOL
        )?;

        // TODO: check course state: If the course has start -> not possible to join

        ctx.accounts.subscription.course = ctx.accounts.course.key();
        ctx.accounts.subscription.student = ctx.accounts.signer.key();
        ctx.accounts.subscription.group = None;
        ctx.accounts.subscription.name = name;
        ctx.accounts.subscription.availability = availability;
        ctx.accounts.subscription.skills = skills;
        ctx.accounts.subscription.interests = interests;
        ctx.accounts.subscription.active = false; // student is inactive by default.

        Ok(())
    }

    pub fn student_attendance(ctx: Context<StudentAttendance>) -> Result<()> {
        ctx.accounts.attendance.session = ctx.accounts.session.key();
        ctx.accounts.attendance.student = ctx.accounts.signer.key();

        Ok(())
    }

    pub fn create_group(ctx: Context<CreateGroup>) -> Result<()> {
        // Only a course admin can create a group
        require!(ctx.accounts.course.admins.contains(&ctx.accounts.signer.key()), CustomErrors::OnlyCourseAdminCanCreateGroup);

        ctx.accounts.course.groups_counter += 1;

        ctx.accounts.group.id = ctx.accounts.course.groups_counter;
        ctx.accounts.group.course = ctx.accounts.course.key();

        Ok(())
    }

    pub fn add_student_to_group(ctx: Context<AddStudentToGroup>) -> Result<()> {
        // Only a course admin can add a student to a group
        require!(ctx.accounts.course.admins.contains(&ctx.accounts.signer.key()), CustomErrors::OnlyCourseAdminCanCreateGroup);

        // Check size of group
        require!(ctx.accounts.group.students.len()<MAX_STUDENTS_PER_GROUP, CustomErrors::ExceedingMaximumGroupMembers);

        // Check if student is not member of another group for this course (subscription)
        require!(ctx.accounts.subscription.group.is_none(), CustomErrors::StudentIsMemberOfAnotherGroup);

        // TODO: Can't add an inactive student to a group

        ctx.accounts.group.students.push(ctx.accounts.subscription.student);
        ctx.accounts.subscription.group = Some(ctx.accounts.group.key());

        Ok(())
    }

    pub fn group_swap_request(ctx: Context<GroupSwapRequest>) -> Result<()> {
        ctx.accounts.swap_request.requested_group = ctx.accounts.requested_group.key();
        ctx.accounts.swap_request.student = ctx.accounts.signer.key();

        ctx.accounts.swap_request.course = ctx.accounts.course.key();
        ctx.accounts.swap_request.subscription = ctx.accounts.subscription.key();

        Ok(())
    }

    pub fn accept_group_swap(ctx: Context<AcceptGroupSwap>) -> Result<()> {
        // The signer is the student who accepts the swap request

        // 1. Remove the signer from the destination group:
        ctx.accounts.signer_group.students.retain(|&x| x != ctx.accounts.signer.key());

        // 2. Remove the requesting student from his initial group:
        ctx.accounts.requesting_student_group.students.retain(|&x| x != ctx.accounts.requesting_student.key());

        // 3. Add the requesting student to the destination group:
        ctx.accounts.signer_group.students.push(ctx.accounts.requesting_student.key());

        // 4. Add the signer to the requesting student initial group:
        ctx.accounts.requesting_student_group.students.push(ctx.accounts.signer.key());

        // 5. Groups are also stored in subscription. We need to update subscriptions data-accounts
        ctx.accounts.requesting_student_subscription.group = Some(ctx.accounts.signer_group.key());
        ctx.accounts.signer_subscription.group = Some(ctx.accounts.requesting_student_group.key());
        
        Ok(())
    }

    pub fn withdraw_revenues(ctx: Context<WithdrawRevenues>) -> Result<()> {
        // The code bellow does not work.
        // To fetch SOL of a PDA, we must work with try_borrow_mut_lamports()
        /*
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.school.to_account_info(),
                    to: ctx.accounts.signer.to_account_info(),
                },
            ),
            ctx.accounts.school.to_account_info().lamports()
        )?;
        */


        let account_size = ctx.accounts.school.to_account_info().try_data_len()?;
        let rent = Rent::get()?.minimum_balance(account_size);

        let amount = ctx.accounts.school.to_account_info().lamports() - rent; // Signer takes everything on the school data-account balance, except the rent

        // sum of account balances before and after instruction must match:
        **ctx.accounts.school.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.signer.to_account_info().try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}
