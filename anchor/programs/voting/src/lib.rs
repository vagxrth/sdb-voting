#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("GtmUW6EWbYxGcs28rssHopDVafxebPYwZorAt5AS8tEY");

#[program]
pub mod voting {
    use super::*;

    // initializing poll
    pub fn initialize_poll(ctx: Context<InitializePoll>, poll_id: u64, poll_start: u64, poll_end: u64, description: String) -> Result<()> {
      let poll = &mut ctx.accounts.poll;
      poll.poll_id = poll_id;
      poll.description = description;
      poll.poll_start = poll_start;
      poll.poll_end = poll_end;
      poll.candidate_number = 0;
      Ok(())
    }

    //initializing candidates
    pub fn initialize_candidate(ctx: Context<InitializeCandidate>, candidate_name: String, _poll_id: u64) -> Result<()> {
      let candidate = &mut ctx.accounts.candidate;
      let poll = &mut ctx.accounts.poll_account;
      poll.candidate_number += 1;
      candidate.candidate_name = candidate_name;
      candidate.candidate_votes = 0;
      Ok(())
    }

    // vote
    pub fn vote(ctx: Context<Vote>, _candidate_name: String, _poll_id: u64) -> Result<()> {
      let candidate = &mut ctx.accounts.candidate;
      candidate.candidate_votes +=1;
      Ok(())
    }

}

// poll account
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


// candidate account
#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id: u64)]
pub struct InitializeCandidate<'info> {
  
  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub poll_account: Account<'info, Poll>,

  #[account(
    init,
    payer = signer,
    space = 8 + Candidate::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_ref()],
    bump
  )]
  pub candidate: Account<'info, Candidate>
}

// vote account
#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id: u64)]
pub struct Vote<'info> {

  pub signer: Signer<'info>,

  #[account(
    mut,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll_account: Account<'info, Poll>,

  #[account(
    mut,
    seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_ref()],
    bump
  )]
  pub candidate: Account<'info, Candidate>
}

// poll struct
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

// candidate struct
#[account]
#[derive(InitSpace)]
pub struct Candidate {
  #[max_len(50)]
  pub candidate_name: String,
  pub candidate_votes: u64
}