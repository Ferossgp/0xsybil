"use client";
import { FormEventHandler, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { isAddress } from "@/lib/address";

export default function Home() {
  const [address, setAddress] = useState<string>("");
  const router = useRouter();

  const onSubmit: FormEventHandler<HTMLFormElement> = (evt) => {
    evt.preventDefault();
    router.push(`/address/${address}`);
  };

  console.log(address, isAddress(address));
  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-6">
      <h1 className="text-7xl font-medium font-mono">0xSybil</h1>
      <form onSubmit={onSubmit} className="flex gap-4 w-full sm:w-2/3">

        <Input
          className="w-full"
          onChange={(evt) => {
            setAddress(evt.target.value);
          }}
          placeholder="0x0000....0000"
        />
        {address.length > 0 ? (
          <Button
            type="submit"
            className="animate-in slide-in-from-right-2 fade-in-50"
          >
            Expose
          </Button>
        ) : null}
      </form>
    </div>
  );
}
