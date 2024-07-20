'use client';

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getSchoolInfos, withdrawal } from "@api/educhain";
import { SchoolAccountData } from "~/app/types/educhain";

import { vstack, grid, hstack } from "styled-system/patterns";
import { css } from "styled-system/css";

import { useModalsProvider } from "~/app/context/modals";
import CreateSchoolModal from "~/app/components/modals/createSchool";
import CreateCourseModal from "~/app/components/modals/createCourse";
import CourseCreate from "~/app/components/cards/courseCreateCard";
import AdminCoursesList from "~/app/components/lists/adminCoursesList";
import { useProgram } from "~/app/components/solana/solana-provider";
import { getBalance } from "~/app/components/solana/solana.helpers";
import { School } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Loading from "~/app/components/loading";

function SchoolCreate() {

  const { CreateSchoolModalContext } = useModalsProvider();
  const { setOpen } = CreateSchoolModalContext;

  return (
      <div className={vstack({
        gap: "20",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
      })}>
        <h1 className={css({
            fontSize: "4xl",
            fontWeight: "bold",
            color: "text"
        })}>{'Ce compte n\'a pas d\'école associée'}</h1>
        <Button onClick={() => setOpen(true)} size={"2xl"}>
            Créer une école
            <School/>
        </Button>
        <CreateSchoolModal />
      </div>
  );
}

function SchoolData(
  {schoolData, schoolAddress}:
  {schoolData: SchoolAccountData, schoolAddress: PublicKey}
) {

  console.log("schoolData", schoolData.name);

  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const program = useProgram();
  const wallet = useWallet();

  const handleWithdrawal = async () => {
    await withdrawal(program, wallet, schoolAddress);
  };

  useEffect(() => {
    console.log("useEffect: ", schoolAddress);
    const fetchBalance = async () => {
      const balance = await getBalance(schoolAddress);
      setBalance(Number(balance.toFixed(2)));
      setIsLoading(false);
    };
    fetchBalance();
  }, []);

  return (
    <>
      {
        isLoading ?
          <Loading />
        :
      <>
        <div className={hstack({
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        })}>
          <h1 className={css({
            fontSize: "4xl",
            fontWeight: "bold",
            color: "text",
          })}>{schoolData.name}</h1>
          {
            balance > 0 ? 
              <Badge
                size="lg"
                variant="solid"
                onClick={balance > 0 ? handleWithdrawal : undefined}
                className={css({
                  cursor: "pointer",
                  _hover: {
                    bg: "purple",
                    transform: "scale(1.1)",
                  }
                })}
              >Withdrawal: {balance.toFixed(2)} SOL</Badge>
            : 
              <Badge
                size="lg"
                variant="outline"
              >No revenue to withdraw</Badge>
          }
        </div>
        <p className={css({
            fontSize: "xl",
            fontWeight: "bold",
            color: "text",
        })}>{schoolAddress.toBase58()}</p>
        <hr
        className={css({
          width: "100%",
          height: "5px",
          backgroundColor: "ui.background",
          border: "none",
          margin: "10px 0",
        })}/>
        <div className={grid({
            gap: 6,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
            gridAutoRows: "minmax(300px, 1fr)",
          })}
          >
            <AdminCoursesList schoolAddress={schoolAddress} />
            <CourseCreate />
        </div>
      </>
      }
      <CreateCourseModal />
    </>
  );
}

function SchoolPage() {

  const program = useProgram();
  const wallet = useWallet();
  
  const [schoolData, setSchoolData] = useState<SchoolAccountData | null>(null);
  const [schoolAddress, setSchoolAddress] = useState<PublicKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      const data = await getSchoolInfos(program, wallet.publicKey as PublicKey);
      if (data) {
        setSchoolData(data.account);
        setSchoolAddress(data.publicKey);
      }
      setIsLoading(false);
    };
    fetchSchoolData();
  },[]);
  

  return (
    <div className={css({p: 6})}>
      {
        isLoading ?
          <Loading />
        :
        schoolData && schoolAddress ?
          <SchoolData schoolData={schoolData} schoolAddress={schoolAddress}/>
        : 
          <SchoolCreate/>
      }
    </div>
  );
}

export default SchoolPage;
