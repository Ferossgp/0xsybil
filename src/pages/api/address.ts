import { graphQLClient } from "@/lib/eas";
import { FETCH_ATTESTATIONS } from "@/queries/eas";
import { ethers } from "ethers";
import frauds from '../../database.json'
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as (string | undefined)

  if (address == null) {
    res.status(400).send({ error: 'invalid address' })
    return
  }

  const data = await graphQLClient.request<any>(FETCH_ATTESTATIONS, {
    "where": {
      "recipient": {
        "equals": ethers.utils.getAddress(address)
      }
    }
  });

  const fraud = (frauds as Record<string, any>)[address.toLowerCase()]

  res.status(200).send({
    attestations: data.attestations,
    fraud: fraud
  })
}
