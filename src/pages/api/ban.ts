
import { NextApiRequest, NextApiResponse } from "next"
import { attestData } from "@/queries/createAndRevoke"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // TODO: store who requeste revoke the attestation in metadata
  if (req.body.auth === process.env.AUTH) {
    try {
      const address = req.body.address
      const result = await attestData(address)
      res.status(200).send({ result })
      return
    } catch (err) {
      console.log(err)
      res.status(500).send({ error: 'unexpected error' })
      return
    }
  }

  res.status(401).send({ error: 'not authenticated' })
}