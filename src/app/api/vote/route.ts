import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions"


export async function GET(request: Request) {
  const actionMetadata: ActionGetResponse = {
    icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ftimesofindia.indiatimes.com%2Fworld%2Fus%2Fharris-vs-trump-debate-why-aides-feel-kamala-harris-is-handcuffed-by-new-rules%2Farticleshow%2F113193089.cms&psig=AOvVaw1-UHASLbaPWT6JS4xqY-B3&ust=1729204986719000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICXn-H8k4kDFQAAAAAdAAAAABAj",
    title: "Choose Your President!",
    description: "The fight between Trump & Harris to restore America's glory",
    label: "Vote"
  }
  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}
