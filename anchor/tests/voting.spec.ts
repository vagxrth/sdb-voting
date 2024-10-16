import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import {Voting} from '../target/types/voting'
import { startAnchor } from 'solana-bankrun'
import { BankrunProvider } from 'anchor-bankrun'

const IDL = require('../target/idl/voting.json')

const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('voting', () => {

  let context;
  let provider;
  let votingProgram: anchor.Program<Voting>;

  beforeAll(async() => {
    context = await startAnchor("", [{name: 'voting', programId: votingAddress}], []);
    provider = new BankrunProvider(context);

    votingProgram = new Program<Voting>(
      IDL,
      provider
    );
  })

  // initialize voting test
  it('Initialize Voting', async () => {
    
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      new anchor.BN(0),
      new anchor.BN(1729094316),
      "Whom are you voting in 2024?",
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual('Whom are you voting in 2024?');
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
  });

  // initialize candidate test
  it("Initialize Candidate", async() => {

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress
    );

    await votingProgram.methods.initializeCandidate(
      "Trump",
      new anchor.BN(1),
    ).accounts({
      pollAccount: pollAddress
    }).rpc();
    await votingProgram.methods.initializeCandidate(
      "Harris",
      new anchor.BN(1),
    ).accounts({
      pollAccount: pollAddress
    }).rpc();

    // adding candidate 'TRUMP'
    const [trumpAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8) ,Buffer.from('Trump')],
      votingAddress
    );
    const trumpCandidate = await votingProgram.account.candidate.fetch(trumpAddress);
    expect(trumpCandidate.candidateVotes.toNumber()).toEqual(0);

    // adding candidate 'HARRIS'
    const [harrisAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8) ,Buffer.from('Harris')],
      votingAddress
    );
    const harrisCandidate = await votingProgram.account.candidate.fetch(harrisAddress);
    expect(harrisCandidate.candidateVotes.toNumber()).toEqual(0);
  })

  // vote test
  it("Vote", async() => {
    await votingProgram.methods.vote(
      "Trump",
      new anchor.BN(1)
    ).rpc()

    const [trumpAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8) ,Buffer.from('Trump')],
      votingAddress
    );
    const trumpCandidate = await votingProgram.account.candidate.fetch(trumpAddress);
    expect(trumpCandidate.candidateVotes.toNumber()).toEqual(1);
    console.log(trumpCandidate);


    const [harrisAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8) ,Buffer.from('Harris')],
      votingAddress
    );
    const harrisCandidate = await votingProgram.account.candidate.fetch(harrisAddress);
    expect(harrisCandidate.candidateVotes.toNumber()).toEqual(0);
    console.log(harrisCandidate)
  })
})