"use client";
import { Input } from "@/components/ui/input";
import frauds from "../database.json";
import Link from "next/link";

export default function Home() {
  const addresses = Object.keys(frauds);

  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-6">
      <h1 className="text-7xl font-medium font-mono">0xSybil</h1>
      <div className="w-full flex flex-col gap-6 sm:w-2/3">
        <div className="flex gap-4 items-center">
          <b className="w-32">Snapshot:</b>
          <Input className="flex-1" value="0x1275828152a7f044dca9768212b108df346cd04c0680cd3a6249e8e1f3adddbc" disabled />
        </div>
        <div className="flex gap-4 items-center">
          <b className="w-32">Addresses:</b>
          <div className="flex flex-1 gap-4">
            {addresses.map((address) => (
              <Link key={address} href={`/address/${address}`} className="px-4 py-2 border rounded-lg shadow-sm font-mono">
                {address}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
