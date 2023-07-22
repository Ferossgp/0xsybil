"use client";
import { AlertOctagonIcon, Badge, Loader } from "lucide-react";
import { signIn, useSession } from "next-auth/react"
import Header from "@/components/Header";
import useSWR, { Fetcher } from "swr";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useSWRMutation from 'swr/mutation'

interface Params {
  params: {
    address: string;
  };
}

interface Fraud {
  address: string;
  poaps: number,
  transactions: number
}

const fetcher: Fetcher<any, string> = async (...args) => {
  const res = await fetch(...args).then((res) => res.json());
  return res;
};

const RenderFrauds: React.FC<{ frauds: Fraud[] }> = ({ frauds }) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full sm:w-2/3">
        <Table>
          <TableCaption>Similar accounts</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Common Poaps</TableHead>
              <TableHead>Similar Transactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {frauds.map((fraud) => (
              <TableRow key={fraud.address}>
                <Link href={`/address/${fraud.address}`}>
                  <TableCell className="font-mono">{fraud.address}</TableCell>
                </Link>
                <TableCell>{fraud.poaps} POAPS</TableCell>
                <TableCell>{fraud.transactions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const requestCleanup = async (url: string, { arg }: { arg: { attestationId: string } }) => {
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      attestationId: arg.attestationId
    })
  }).catch((err) => { console.error(err) })

  return new Promise((resolve) => { setTimeout(resolve, 10000) })
}

export default function Address(params: Params) {
  const { data: session, status } = useSession()
  const address = params.params.address;

  const { data, isLoading, } = useSWR(`/api/address?address=${address}`, fetcher);
  const { trigger, isMutating } = useSWRMutation('/api/cleanup', requestCleanup, {
    onSuccess: () => {
      window.location.reload()
    }
  })

  const loading = (status === "loading" && isLoading) || isMutating

  if (data == null) return (
    <div className="absolute inset-0 flex justify-center items-center bg-black/[0.7]">
      <Loader className="animate-spin text-white" size={48} />
    </div>
  )

  const state = data?.attestations?.find((attestation: any) => {
    return attestation.revocationTime === 0
  }) != null

  const frauds = (data?.fraud ?? []) as Fraud[]
  const revokable = data?.attestations?.filter((fraud: any) => {
    return fraud.revocationTime === 0
  })

  return (
    <div className="flex flex-col flex-1 gap-8">
      <Header />

      <div className="flex flex-col gap-6 items-center flex-1">
        {state ? (<AlertOctagonIcon className="text-red-500" size={96} />) : (<Badge size={96} className="text-green-500" />)}
        <h1 className="text-2xl">Address: <span className="font-mono">{address}</span> {state ? " was marked with a high risk" : " has not been detectect"}</h1>

        <div className="flex flex-col gap-2">
          <h3 className="text-xl text-center">Prove identity to get cleanedup</h3>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-black/[0.7]">
              <Loader className="animate-spin text-white" size={48} />
            </div>
          )}

          {!session ? (
            <div className="flex gap-4 items-center justify-center">
              {/* <button className="bg-black shadow-sm rounded-xl py-2 px-4 flex gap-4 justify-center items-center">
                <b className="text-white">Verify with</b>
                <svg fill="none" viewBox="0 0 144 78" xmlns="http://www.w3.org/2000/svg" className="w-16"><path d="M18 0H0l22.5 39L0 78h18l22.5-39z" fill="#1c68f3"></path><path d="M61.5 0h15v78h-15z" fill="#fff"></path><path clip-rule="evenodd" d="M84 0v78h21c21.539 0 39-17.46 39-39S126.539 0 105 0zm15 63h6c13.255 0 24-10.745 24-24s-10.745-24-24-24h-6z" fill="#fff" fill-rule="evenodd"></path><path d="M39 63h15v15H39z" fill="#1c68f3"></path></svg>
              </button> */}
              <button className="bg-black shadow-sm rounded-xl py-2 px-4 flex gap-4 justify-center items-center"
                onClick={(e) => {
                  e.preventDefault()
                  signIn("worldcoin")
                }}
              >
                <svg width="188" height="32" viewBox="0 0 188 32" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_17_787)">
                    <path d="M68.7294 9.91241C72.0806 9.91241 74.8174 12.6489 74.8174 15.9997C74.8174 19.3504 72.0806 22.0869 68.7294 22.0869C65.3781 22.0869 62.6413 19.3504 62.6413 15.9997C62.6413 12.6489 65.3502 9.91241 68.7294 9.91241ZM68.7294 6.98047C63.7584 6.98047 59.709 11.0293 59.709 15.9997C59.709 20.97 63.7584 25.0189 68.7294 25.0189C73.7003 25.0189 77.7497 20.97 77.7497 15.9997C77.7497 11.0014 73.7003 6.98047 68.7294 6.98047Z" fill="white" />
                    <path d="M156.112 9.91241C159.463 9.91241 162.2 12.6489 162.2 15.9997C162.2 19.3504 159.463 22.0869 156.112 22.0869C152.761 22.0869 150.024 19.3504 150.024 15.9997C150.024 12.6489 152.761 9.91241 156.112 9.91241ZM156.112 6.98047C151.141 6.98047 147.092 11.0293 147.092 15.9997C147.092 20.97 151.141 25.0189 156.112 25.0189C161.083 25.0189 165.133 20.97 165.133 15.9997C165.133 11.0014 161.111 6.98047 156.112 6.98047Z" fill="white" />
                    <path d="M142.511 18.0939C141.645 20.4395 139.411 22.0869 136.786 22.0869C133.435 22.0869 130.698 19.3504 130.698 15.9997C130.698 12.6489 133.435 9.91241 136.786 9.91241C139.411 9.91241 141.645 11.5878 142.511 13.9054H145.555C144.633 9.94033 141.059 6.98047 136.786 6.98047C131.815 6.98047 127.766 11.0293 127.766 15.9997C127.766 20.97 131.815 25.0189 136.786 25.0189C141.059 25.0189 144.633 22.059 145.555 18.0939H142.511Z" fill="white" />
                    <path d="M117.209 10.1937C120.477 10.1937 123.13 12.9301 123.018 16.2251C122.906 19.3804 120.225 21.8097 117.07 21.8097H113.858V10.1937H117.209ZM117.209 7.26172H110.926V24.7416H117.209C122.041 24.7416 125.95 20.8324 125.95 16.0017C125.95 11.171 122.041 7.26172 117.209 7.26172Z" fill="white" />
                    <path d="M170.216 7.28906H167.283V24.7131H170.216V7.28906Z" fill="white" />
                    <path d="M44.0696 24.7947L47.3929 11.978L50.7162 24.7947H54.7377L59.2898 7.20312H56.2737L52.727 20.8576L49.1803 7.20312H45.6056L42.0589 20.8576L38.5122 7.20312H35.4961L40.0482 24.7947H44.0696Z" fill="white" />
                    <path d="M176.079 12.3158L184.96 24.7137H185.295H187.892V7.28964H184.96V19.6875L176.079 7.26172H175.855L175.827 7.28964H173.146V24.7137H176.079V12.3158Z" fill="white" />
                    <path d="M99.4753 7.28906H96.543V24.7131H108.775V21.7812H99.4753V7.28906Z" fill="white" />
                    <path d="M90.9038 17.5363C92.6911 16.6428 93.9199 14.8277 93.9199 12.7056C93.9199 9.7178 91.4902 7.31641 88.53 7.31641H83.0005H79.9844V18.1227V24.7405H83.0005V18.0948H84.6761C88.2507 18.2065 91.0993 21.1105 91.0993 24.7126H94.1154C94.1433 21.8644 92.8866 19.2955 90.9038 17.5363ZM83.0005 15.0791V10.3042H88.53C89.8426 10.3042 90.9038 11.3653 90.9038 12.6777C90.9038 13.9901 89.8426 15.0791 88.53 15.0791H83.0005Z" fill="white" />
                    <path d="M30.7195 9.77312C29.9097 7.87434 28.7647 6.17103 27.2845 4.6911C25.8044 3.21117 24.1288 2.06632 22.2298 1.25654C20.247 0.418848 18.1525 0 16.0021 0C13.8238 0 11.7293 0.418848 9.7744 1.25654C7.87537 2.06632 6.17184 3.21117 4.69171 4.6911C3.21159 6.17103 2.06659 7.87434 1.25671 9.77312C0.418903 11.7277 0 13.822 0 16C0 18.1501 0.418903 20.2443 1.25671 22.2269C2.06659 24.1257 3.21159 25.829 4.69171 27.3089C6.17184 28.7888 7.87537 29.9337 9.7744 30.7155C11.7572 31.5532 13.8517 31.9721 16.0021 31.9721C18.1525 31.9721 20.247 31.5532 22.2298 30.7155C24.1288 29.9058 25.8323 28.7609 27.3125 27.281C28.7926 25.801 29.9376 24.0977 30.7475 22.1989C31.5853 20.2164 32.0042 18.1222 32.0042 15.9721C32.0042 13.822 31.5574 11.7277 30.7195 9.77312ZM10.696 14.4921C11.3383 11.9232 13.6842 10.0524 16.4489 10.0524H27.5638C28.2899 11.4206 28.7367 12.9284 28.9043 14.4921H10.696ZM28.9043 17.5079C28.7367 19.0716 28.262 20.5794 27.5638 21.9476H16.4489C13.6842 21.9476 11.3662 20.0489 10.696 17.5079H28.9043ZM6.81415 6.81326C9.27172 4.35602 12.5392 3.01571 16.0021 3.01571C19.465 3.01571 22.7325 4.35602 25.19 6.81326C25.2738 6.89703 25.3297 6.95288 25.4134 7.03665H16.4489C14.0472 7.03665 11.8131 7.95811 10.1095 9.66143C8.76903 11.0017 7.9033 12.6771 7.62403 14.4921H3.09988C3.435 11.5881 4.71964 8.9075 6.81415 6.81326ZM16.0021 28.9843C12.5392 28.9843 9.27172 27.644 6.81415 25.1867C4.71964 23.0925 3.435 20.3839 3.09988 17.5079H7.62403C7.93123 19.3229 8.79696 20.9983 10.1095 22.3386C11.8131 24.0419 14.0472 24.9633 16.4489 24.9633H25.4134C25.3297 25.0471 25.2738 25.103 25.19 25.1867C22.7325 27.644 19.465 28.9843 16.0021 28.9843Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_17_787">
                      <rect width="187.892" height="32" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          ) : (
            revokable?.map((attestation: any) => (
              <Button
                key={attestation.id}
                onClick={() => {
                  trigger({ attestationId: attestation.id })
                }}>Request Account Cleanup</Button>
            ))
          )}
        </div>
      </div>
      <RenderFrauds frauds={frauds} />
    </div>
  )
}
