
'use client'
import { useWallet } from "@solana/wallet-adapter-react";
import { PropsWithChildren } from "react";
import { getProgram } from "./components/Program/program";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import { center } from "styled-system/patterns";

const ContentContainer = (props: PropsWithChildren) => {
  const wallet = useWallet();
  if (!wallet.connected) {
    return (
      <main>
        Please connect your wallet to continue
      </main>
    )
  }
  const program = getProgram(wallet as Wallet);

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