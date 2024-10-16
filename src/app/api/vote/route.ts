import { Connection, PublicKey } from '@solana/web3.js';
import { ActionPostRequest, LinkedAction } from './../../../../node_modules/@solana/actions-spec/index.d';
import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions"


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
          href: "/api/vote?candidate=trump",
          type: 'transaction'
        },
        {
          label: "Vote for Harris",
          href: "/api/vote?candidate=harris",
          type: 'transaction'
        }
      ]
    }
  }
  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get('candidate');

  if (candidate !== 'Trump' && candidate !== 'Harris' ) {
    return new Response("Invalid Candidate", { status: 400, headers: ACTIONS_CORS_HEADERS })
  }

  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const body: ActionPostRequest = await request.json();
  let voter;

  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid Account", { status: 400, headers:ACTIONS_CORS_HEADERS })
  }
}