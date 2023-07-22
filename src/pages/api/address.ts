import { NextRequest } from "next/server";
import { graphQLClient } from "@/lib/eas";
import { FETCH_ATTESTATIONS } from "@/queries/eas";
import { ethers } from "ethers";
import frauds from '../../database.json'
import { attestData } from "@/queries/createAndRevoke";

export const config = {
  runtime: "edge"
}

export default async function handler(req: NextRequest) {

  // const aa = await attestData("0x6b931a072451a72E49515E5E22e8Eb71511514b5".toLowerCase())
  // console.log("aaaa", aa)

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
