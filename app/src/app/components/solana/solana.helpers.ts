import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl('devnet'));

export const getBalance = async (publicKey: PublicKey) => {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
}
