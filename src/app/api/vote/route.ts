import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { ActionPostRequest } from './../../../../node_modules/@solana/actions-spec/index.d';
import { ActionGetResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { Voting } from '../../../../anchor/target/types/voting';
import { Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor'
import IDL from '../../../../anchor/target/idl/voting.json'

export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetadata: ActionGetResponse = {
    icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftimesofindia.indiatimes.com%2Fworld%2Fus%2Fharris-vs-trump-debate-why-aides-feel-kamala-harris-is-handcuffed-by-new-rules%2Farticleshow%2F113193089.cms&psig=AOvVaw1-UHASLbaPWT6JS4xqY-B3&ust=1729204986719000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICXn-H8k4kDFQAAAAAdAAAAABAj",
    title: "Choose Your President!",
    description: "The fight between Trump & Harris to restore America's glory",
    label: "Vote",
    links: {
      actions: [
        {
          label: "Vote for Trump",
          href: "/api/vote?candidate=Trump",
          type: 'transaction'
        },
        {
          label: "Vote for Harris",
          href: "/api/vote?candidate=Harris",
          type: 'transaction'
        }
      ]
    }
  }
  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get('candidate') as string;

  if (candidate !== 'Trump' && candidate !== 'Harris' ) {
    return Response.json({error: "Invalid Candidate"}, { status: 400, headers: ACTIONS_CORS_HEADERS })
  }

  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const program: Program<Voting> = new Program(IDL as Voting, { connection })

  const body: ActionPostRequest = await request.json();
  let voter;

  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid Account", { status: 400, headers:ACTIONS_CORS_HEADERS })
  }

  const instruction = await program.methods.vote('Trump', new anchor.BN(1)).accounts({
    signer: voter
  }).instruction();

  const blockHashResponse = await connection.getLatestBlockhash();

  const tx = new Transaction({
    feePayer: voter,
    blockhash: blockHashResponse.blockhash,
    lastValidBlockHeight: blockHashResponse.lastValidBlockHeight
  }).add(instruction)

  const response = await createPostResponse({
    fields: {
      transaction: tx
    },
  });

  return Response.json(response, { headers: ACTIONS_CORS_HEADERS })

}