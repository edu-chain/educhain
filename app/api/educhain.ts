import { Connection, PublicKey, SystemProgram, clusterApiUrl } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { Educhain } from "@api/types/educhain";
import { WalletContextState } from "@solana/wallet-adapter-react";

export async function getSchoolDataAccount(
    program: Program<Educhain>,
    publicKey: PublicKey,
){
    const school = PublicKey.findProgramAddressSync(
        [
            Buffer.from("school"),
            publicKey.toBuffer()
        ],
        program.programId
    );

    try {
        const schoolData = await program.account.schoolDataAccount.fetch(school[0]);
        return schoolData;
    } catch (error) {
        return null;
    }
}

export async function createSchoolDataAccount(
    program: Program<Educhain>,
    wallet: WalletContextState
){

    if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet error!");
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    const [school] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("school"),
            wallet.publicKey.toBuffer()
        ],
        program.programId
    );
    
    const transaction = await program.methods
        .initializeSchool(
            `${wallet.publicKey.toBase58().slice(0, 4)}...${wallet.publicKey.toBase58().slice(-4)} Academy`
        )
        .accounts({
            school: school,
            signer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .transaction();

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = blockhash;
    const signedTransaction = await wallet.signTransaction(transaction);
    await connection.sendRawTransaction(signedTransaction.serialize());
}
