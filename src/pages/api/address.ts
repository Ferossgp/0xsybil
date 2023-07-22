import { NextRequest } from "next/server";
import { graphQLClient } from "@/lib/eas";
import { FETCH_ATTESTATIONS } from "@/queries/eas";

export const config = {
  runtime: "edge"
}

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')

  if (address == null) {
    return new Response(
      JSON.stringify({
        response: 'invalid address'
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  }

  const data = await graphQLClient.request<any>(FETCH_ATTESTATIONS, {
    request: {
      "where": {
        "recipient": {
          "equals": address
        }
      }
    },
  });

  console.log(data)

  return new Response(
    JSON.stringify({
      attestations: data,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
}
