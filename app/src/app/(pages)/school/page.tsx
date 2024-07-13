'use client';

import { useProgram } from "~/app/components/solana/solana-provider";
import { useEffect, useState } from "react";
import { createSchoolDataAccount, getSchoolDataAccount } from "@api/educhain";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

function SchoolPage() {
    const program = useProgram();
    const wallet = useWallet();
    const [schoolData, setSchoolData] = useState<any>(null);

    const handleCreateSchool = async () => {
        if (program && wallet) {
            await createSchoolDataAccount(program, wallet);
        }
    };

    useEffect(() => {
        const fetchSchoolData = async () => {
            const data = await getSchoolDataAccount(wallet.publicKey as PublicKey, program);
            setSchoolData(data);
        };
        fetchSchoolData();
    },[wallet.publicKey]);

    return (
        <div>
            {schoolData ? (
                <div>{JSON.stringify(schoolData)}</div>
            ) : (
                <>
                <div>Ce compte n'a pas d'école associée</div>
                <button onClick={handleCreateSchool}>Créer une école</button>
                </>
            )}
        </div>
    );
}

export default SchoolPage;