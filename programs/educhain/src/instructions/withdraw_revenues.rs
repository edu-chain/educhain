use anchor_lang::prelude::*;
use crate::state::school_data_account::SchoolDataAccount;

#[derive(Accounts)]
pub struct WithdrawRevenues<'info> {
   #[account(
        mut,
        seeds = [
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
