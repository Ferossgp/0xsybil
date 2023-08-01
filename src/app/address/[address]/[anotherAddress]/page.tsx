"use client";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react"
import Header from "@/components/Header";
import useSWR, { Fetcher } from "swr";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

interface Params {
  params: {
    address: string;
    anotherAddress: string;
  };
}

interface Transactions {
  og_hash: string;
  hash: string;
  chain: string;
}

function getExplorerLink(hash: string, chainName: string) {
  switch (chainName) {
    case "ethereum":
      return `https://etherscan.io/tx/${hash}`;
    case "polygon":
      return `https://polygonscan.com/tx/${hash}`;
    case "fantom":
      return `https://ftmscan.com/tx/${hash}`;
    case "xdai":
      return `https://gnosisscan.io/tx/${hash}`;
    case "optimism":
      return `https://optimistic.etherscan.io/tx/${hash}`;
    case "arbitrum":
      return `https://arbiscan.io/tx/${hash}`;
    case "binance-smart-chain":
      return `https://bscscan.com/tx/${hash}`;
    case "avalanche":
      return `https://cchain.explorer.avax.network/tx/${hash}`;
    case "aurora":
      return `https://explorer.aurora.dev/transactions/${hash}`;
    default:
      return "unsupported chain";
  }
}

const fetcher: Fetcher<any, string> = async (...args) => {
  const res = await fetch(...args).then((res) => res.json());
  return res;
};

const testTxs = [
  {
    og_hash: "0x5a85ab11547bda4831265483adefc1882cb376d080a5f06bc3316c3e7725dfe9",
    hash: "0x1917fd93a854d2daecb2f2f7b2e39eea8943bd750ea44bc1850c9baa64314643",
    chain: "polygon",
  }
]


const RenderTxs: React.FC<{ txs: Transactions[] }> = ({ txs }) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full sm:w-2/3">
        <Table>
          <TableCaption>Similar accounts</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Hash1</TableHead>
              <TableHead>Hash2</TableHead>
              <TableHead>Chain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {txs.map((tx, i) => (
              <TableRow key={tx.og_hash}>
                <TableCell>{i+1}</TableCell>
                <TableCell>
                  <Link className="underline" href={getExplorerLink(tx.og_hash, tx.chain)}>{`${tx.og_hash.slice(0,19)}...`}</Link>
                  <span className="font-base"> ↗</span>
                </TableCell>
                <TableCell>
                  <Link className="underline" href={getExplorerLink(tx.hash, tx.chain)}>{`${tx.hash.slice(0,19)}...`}</Link>
                  <span className="font-base"> ↗</span>
                </TableCell>
             
                <TableCell>{tx.chain}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function Page(params: Params) {
  const { data: session, status } = useSession()
  const address = params.params.address.toLowerCase() ;
  const anotherAddress = params.params.anotherAddress.toLowerCase();

  const { data, isLoading, } = useSWR(`/api/transactions?address=${address}&anotherAddress=${anotherAddress}`, fetcher);

  const loading = (status === "loading" && isLoading)

  if (data == null) return (
    <div className="absolute inset-0 flex justify-center items-center bg-black/[0.7]">
      <Loader className="animate-spin text-white" size={48} />
    </div>
  )

  const txs = (data?.transactions ?? []) as Transactions[]


  return (
    <div className="flex flex-col flex-1 gap-8">
      <Header />
      <div className="flex flex-col gap-6 items-center flex-1">
        <h1 className="text-2xl">Similar transactions<span className="font-mono">
          </span></h1>
        <h1 className="text-2xl">Main address: <span className="font-mono">
          <Link className="underline" href={`/address/${address}/`}>{address}</Link>
          </span></h1>
        <h1 className="text-2xl">Compared address: <span className="font-mono">
        <Link className="underline" href={`/address/${anotherAddress}/`}>{anotherAddress}</Link>
          </span></h1>
      </div>
      <RenderTxs txs={txs} />
      </div>
  )
}
