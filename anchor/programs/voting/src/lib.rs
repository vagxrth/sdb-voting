#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize_poll (ctx: Context<InitializePoll>, poll_id: u64, poll_start: u64, poll_end: u64, description: String) -> Result<()> {
      let poll = &mut ctx.accounts.poll;
      poll.poll_id = poll_id;
      poll.description = description;
      poll.poll_start = poll_start;
      poll.poll_end = poll_end;
      poll.candidate_number = 0;
      Ok(())
    }

}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {

  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,

  #[account(
    init,
    payer = signer,
    space = 8 + Poll::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll: Account<'info, Poll>
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
  pub poll_id: u64,
  #[max_len(100)]
  pub description: String,
  pub poll_start: u64,
  pub poll_end: u64,
  pub candidate_number: u64
}