
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    try {
      // const attestationId = req.body.attestationId
      const result = true //await revoke(attestationId)
      res.status(200).send({ result })
    } catch (err) {
      res.status(500).send({ error: 'failed to fetch data' })
    }
  }

  res.status(401).send({ error: 'not authenticated' })
}