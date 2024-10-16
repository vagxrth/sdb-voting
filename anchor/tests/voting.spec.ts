import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import {Voting} from '../target/types/voting'
import { startAnchor } from 'solana-bankrun'
import { BankrunProvider } from 'anchor-bankrun'

const IDL = require('../target/idl/voting.json')

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('voting', () => {

  it('Initialize Voting', async () => {

    const context = await startAnchor("", [{name: 'voting', programId: votingAddress}], []);
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Voting>(
      IDL,
      provider
    );

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      new anchor.BN(0),
      new anchor.BN(1729094316),
      "Whom are you voting in 2024?",
    ).rpc();
    
  });
})