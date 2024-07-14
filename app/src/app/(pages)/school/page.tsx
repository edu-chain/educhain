'use client';

import { useProgram } from "~/app/components/solana/solana-provider";
import { useEffect, useState } from "react";
import { createSchoolDataAccount, getSchoolDataAccount } from "@api/educhain";
import { WalletContextState, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "~/components/ui/button";
import { vstack, gridItem, grid } from "styled-system/patterns";
import { School } from "lucide-react";
import { css } from "styled-system/css";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "@api/types/educhain";
import { useModalsProvider } from "~/app/context/modals";
import AdminCourseCard from "~/app/components/cards/adminCourseCard";
import CreateCourseModal from "~/app/components/modals/createCourse";

function SchoolCreate(props: {program: Program<Educhain>, wallet: WalletContextState}) {

    const handleCreateSchool = async () => {
        if (props.program && props.wallet) {
            await createSchoolDataAccount(props.program, props.wallet);
        }
    };

    return (
        <div className={vstack({
            gap: "20",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh"
        })}>
            <h1 className={css({
                fontSize: "6xl",
                fontWeight: "bold",
                color: "text"
            })}>Ce compte n'a pas d'école associée</h1>
            <Button onClick={handleCreateSchool} size={"2xl"}>
                Créer une école
                <School/>
            </Button>
        </div>
    );
}

type schoolData = {
  owner: PublicKey,
  name: string,
  coursesCounter: BN,
}

function SchoolData(props: {data: schoolData}) {
  return (
    <>
        <h1 className={css({
            fontSize: "6xl",
            fontWeight: "bold",
            color: "text",
          })}>School Name: {props.data.name}</h1>
    </>
  );
}

function SchoolPage() {
    const program = useProgram();
    const wallet = useWallet();
    const [schoolData, setSchoolData] = useState<schoolData | null>(null);

    useEffect(() => {
        const fetchSchoolData = async () => {
            const data = await getSchoolDataAccount(program, wallet.publicKey as PublicKey);
            setSchoolData(data);
        };
        fetchSchoolData();
    },[wallet.publicKey]);

    return (
        <div className={css({p: 6})}>
            {schoolData ? (
                <SchoolData data={schoolData}/>
            ) : (
                <SchoolCreate program={program} wallet={wallet}/>
            )}
        </div>
    );
}

export default SchoolPage;