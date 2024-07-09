use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct SchoolDataAccount {
    pub owner: Pubkey,		// One School per wallet

    #[max_len(32)]
    pub name: String,

    pub courses_counter: u64
}