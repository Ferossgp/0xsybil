import transactions from '../../txs.json'
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as (string | undefined)
  const anotherAddress = req.query.anotherAddress as (string | undefined)

  if (address == null || anotherAddress == null) {
    res.status(400).send({ error: 'invalid addresses' })
    return
  }

  const key = `${address.toLowerCase()}_${anotherAddress.toLowerCase()}`
  const key2 = `${anotherAddress.toLowerCase()}_${address.toLowerCase()}`
  const txs = (transactions as Record<string, any>)[key] || (transactions as Record<string, any>)[key2]

  res.status(200).send({
    transactions: txs
  })
}
