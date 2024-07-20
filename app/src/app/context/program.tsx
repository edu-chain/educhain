import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { AnchorWallet, ConnectionContextState, Wallet, WalletContextState, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { createContext, useContext } from "react";
import { useProgram } from "../components/solana/solana-provider";
import { Educhain } from "@api/types/educhain";
import IDL from "api/idl/educhain.json";

type DappContextType = {
  connection: Connection;
  wallet: Wallet;
  program: Program;
};

export const DappProviderContext= createContext<any>(null);



export function DappProvider({children}:{children:React.ReactNode}) {
  const wallet = useWallet() as AnchorWallet;
  const connection = useConnection().connection;
  const program = new Program(IDL as Educhain, new AnchorProvider(connection, wallet));

  return (
    <DappProviderContext.Provider value={
      {
        connection,
        wallet,
        program
      }
    }>
      {children}
    </DappProviderContext.Provider>
  );
}

export const useDappProvider = () => {
  return useContext(DappProviderContext);
};