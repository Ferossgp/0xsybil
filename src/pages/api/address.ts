import { NextRequest } from "next/server";
import { graphQLClient } from "@/lib/eas";
import { FETCH_ATTESTATIONS } from "@/queries/eas";
import { ethers } from "ethers";
import frauds from '../../database.json'

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
    "where": {
      "recipient": {
        "equals": ethers.utils.getAddress(address)
      }
    }
  });

  const fraud = (frauds as Record<string, any>)[address.toLowerCase()]

  return new Response(
    JSON.stringify({
      attestations: data.attestations,
      fraud: fraud
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })
}
