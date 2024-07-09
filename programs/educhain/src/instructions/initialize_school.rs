use anchor_lang::prelude::*;
use crate::state::school_data_account::SchoolDataAccount;

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
