import { Program, AnchorProvider} from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import IDL from "api/idl/educhain.json";
import { Educhain } from "api/types/educhain";


export const getProgram = (wallet: Wallet) => {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const provider: AnchorProvider = new AnchorProvider(connection, wallet, { skipPreflight: true });
  
  const program = new Program<Educhain>(IDL as Educhain, provider);

  console.log(program);
  return program;

}
