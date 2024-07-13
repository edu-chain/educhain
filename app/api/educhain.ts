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
        const schoolData = await program.account.schoolDataAccount.fetch(school[0]);
        return schoolData;
    } catch (error) {
        return null;
    }
}

export async function createSchoolDataAccount(program: Program<Educhain>, wallet: any){

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
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = blockhash;
    const signedTransaction = await wallet.signTransaction(transaction);
    await connection.sendRawTransaction(signedTransaction.serialize());
}
