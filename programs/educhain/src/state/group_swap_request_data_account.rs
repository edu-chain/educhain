use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GroupSwapRequestDataAccount {
   pub student: Pubkey,
   pub requested_group: Pubkey,
    
   pub course: Pubkey, // redundant storage...
   pub subscription: Pubkey, // redundant storage...
}       
