
'use client'
import { useWallet } from "@solana/wallet-adapter-react";
import { PropsWithChildren } from "react";
import { useProgram } from "./components/solana/solana-provider";
import { center } from "styled-system/patterns";

const ContentContainer = (props: PropsWithChildren) => {
  const wallet = useWallet();
  const program = useProgram();

  if (!wallet.connected) {
    return (
      <main>
        Please connect your wallet to continue
      </main>
    )
  }

  return (
    <main>
      <div className={center()}>
        <p>{`Program ID: ${program.programId.toBase58()}`}</p>
      </div>
      {props.children}
    </main>
  )
}

export default ContentContainer;