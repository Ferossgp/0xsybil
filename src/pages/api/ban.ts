
import { NextApiRequest, NextApiResponse } from "next"
import { attestData } from "@/queries/createAndRevoke"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // TODO: store who requeste revoke the attestation in metadata
  if (req.body.auth === process.env.AUTH) {
    try {
      const attestationId = req.body.attestationId
      const result = await attestData(attestationId)
      res.status(200).send({ result })
    } catch (err) {
      res.status(500).send({ error: 'failed to fetch data' })
    }
  }

  res.status(401).send({ error: 'not authenticated' })
}