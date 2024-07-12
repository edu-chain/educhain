import { useProgram } from "~/app/components/solana/solana-provider";
import { Connection, PublicKey, SystemProgram, clusterApiUrl } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { Educhain } from "@api/types/educhain";

export async function getSchoolDataAccount(publicKey: PublicKey, program: Program<Educhain>){
    const school = PublicKey.findProgramAddressSync(
        [
            Buffer.from("school"),
            publicKey.toBuffer()
        ],
        program.programId
    );

    try {
        const schoolData = await program.provider.connection.getAccountInfo(school[0]);
        return schoolData;
    } catch (error) {
        return null;
    }
}

export async function createSchoolDataAccount(program: Program<Educhain>, wallet: any){
    console.log("program id: ", program.programId.toBase58());

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    const [school] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("school"),
            wallet.publicKey.toBuffer()
        ],
        program.programId
    );
    
    const transaction = await program.methods.initializeSchool("test")
    .accounts({
        school: school,
        signer: wallet.publicKey,
        systemProgram: SystemProgram.programId,
    })
    .transaction();
    
    const { blockhash } = await connection.getLatestBlockhash();
    console.log("Blockhash: ", blockhash);
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = blockhash;
    console.log("Transaction: ", transaction);

    try {
        const signedTransaction = await wallet.signTransaction(transaction);
        console.log("Signed Transaction: ", signedTransaction);
        let ts = await connection.sendRawTransaction(signedTransaction.serialize());
        console.log("Transaction Signature: ", ts);
    } catch (error) {
        console.error("Transaction Error: ", error);
        if (error.logs) {
            console.error("Transaction Logs: ", error.logs);
        }
    }
}