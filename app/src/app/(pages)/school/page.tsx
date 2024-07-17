'use client';

import { useProgram } from "~/app/components/solana/solana-provider";
import { useEffect, useState } from "react";
import { getCoursesInfos, getSchoolInfos, withdrawal } from "@api/educhain";
import { WalletContextState, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "~/components/ui/button";
import { vstack, gridItem, grid, hstack } from "styled-system/patterns";
import { School } from "lucide-react";
import { css } from "styled-system/css";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "@api/types/educhain";
import { useModalsProvider } from "~/app/context/modals";
import CreateSchoolModal from "~/app/components/modals/createSchool";
import AdminCourseCard from "~/app/components/cards/adminCourseCard";
import CreateCourseModal from "~/app/components/modals/createCourse";
import { CourseData, Infos } from "~/app/types/educhain";
import { Badge } from "~/components/ui/badge";
import { getBalance } from "~/app/components/solana/solana.helpers";

function CourseCreate() {
  const { CreateCourseModalContext } = useModalsProvider()
  const { setOpen } = CreateCourseModalContext

  return (
    <div
      onClick={() => setOpen(true)}
      className={gridItem({
        colSpan: 1,
        rowSpan: 1,
        borderRadius: "md",
        overflow: "hidden",
        boxShadow: "md",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bg: "black",
        color: "white",
        _dark: { bg: "white", color: "black" },
        cursor: "pointer",
        transition: "all 0.2s",
        _hover: { transform: "scale(1.05)" },
      })}
  >
    <span
      className={css({
        fontSize: "4xl",
      })}
    >
      +
    </span>
    <span
      className={css({
        fontSize: "xl",
        fontWeight: "bold",
        color: "gray.800",
        _dark: { color: "white" },
      })}
    >
      Create Course
    </span>
    </div>
  );
}

function CourseList({schoolAddress}: {schoolAddress: PublicKey}) {

  const program = useProgram();
  const [courses, setCourses] = useState<Infos<CourseData>[]>([]);

  if (!program) {
    return null;
  }

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getCoursesInfos(program, schoolAddress);
      setCourses(courses);
    };
    fetchCourses();
  }, []);

  return (
    <>
    {courses.map((course, index) => (
      <AdminCourseCard key={index} {...course} />
    ))}
    </>
  );
}

function SchoolCreate({program, wallet}: {program: Program<Educhain>, wallet: WalletContextState}) {

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
      })}>Ce compte n'a pas d'école associée</h1>
      <Button onClick={() => setOpen(true)} size={"2xl"}>
          Créer une école
          <School/>
      </Button>
      <CreateSchoolModal />
    </div>
  );
}

type schoolData = {
  owner: PublicKey,
  name: string,
  coursesCounter: BN,
}

function SchoolData(props: {schoolData: schoolData, schoolAddress: PublicKey}) {

  const [balance, setBalance] = useState<number>(0);

  const program = useProgram();
  const wallet = useWallet();

  const fetchBalance = async () => {
    const balance = await getBalance(props.schoolAddress);
    setBalance(Number(balance.toFixed(2)));
  };

  const handleWithdrawal = async () => {
    await withdrawal(program, wallet, props.schoolAddress);
  };

  useEffect(() => {
    const mount = async () => {
      await fetchBalance();
    };
    mount();
  }, []);

  return (
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
        })}>{props.schoolData.name}</h1>
       {balance > 0 ? <Badge
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
          >Withdrawal: {balance.toFixed(2)} SOL</Badge> : <Badge
          size="lg"
          variant="outline"
          >No revenue to withdraw</Badge>}
        </div>
          <p className={css({
            fontSize: "xl",
            fontWeight: "bold",
            color: "text",
          })}>{props.schoolAddress.toBase58()}</p>
          <hr
          className={css({
            width: "100%",
            height: "5px",
            backgroundColor: "ui.background",
            border: "none",
            margin: "10px 0",
          })}
          />
          <div className={grid({
          gap: 6,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
          gridAutoRows: "minmax(300px, 1fr)",
        })}
        >
          <CourseList schoolAddress={props.schoolAddress} />
          <CourseCreate />
          <CreateCourseModal />
        </div>
    </>
  );
}

function SchoolPage() {

    const program = useProgram();
    const wallet = useWallet();
    
    const [schoolData, setSchoolData] = useState<schoolData | null>(null);
    const [schoolAddress, setSchoolAddress] = useState<PublicKey | null>(null);

    useEffect(() => {
        const fetchSchoolData = async () => {
            const data = await getSchoolInfos(program, wallet.publicKey as PublicKey);
            if (data) {
                setSchoolData(data.account);
                setSchoolAddress(data.publicKey);
            }
        };
        fetchSchoolData();
    },[wallet.publicKey]);

    return (
        <div className={css({p: 6})}>
            {schoolData && schoolAddress ? (
                <SchoolData schoolData={schoolData} schoolAddress={schoolAddress}/>
            ) : (
                <SchoolCreate program={program} wallet={wallet}/>
            )}
        </div>
    );
}

export default SchoolPage;