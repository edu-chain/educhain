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
import CreateSchoolModal from "~/app/components/modals/createSchool";
import AdminCourseCard from "~/app/components/cards/adminCourseCard";
import CreateCourseModal from "~/app/components/modals/createCourse";

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

// Mock data for courses (replace with actual data fetching logic)
const courses = [
  { courseName: "Mathematics", studentsNumber: 30, maxGroupSize: 5, progress: 75 },
  { courseName: "Physics", studentsNumber: 25, maxGroupSize: 4, progress: 60 },
  { courseName: "Computer Science", studentsNumber: 35, maxGroupSize: 6, progress: 90 },
];

function CourseList() {
  return (
    <>
    {courses.map((course, index) => (
      <AdminCourseCard key={index} {...course} />
    ))}
    </>
  );
}


function SchoolCreate(props: {program: Program<Educhain>, wallet: WalletContextState}) {

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

function SchoolData(props: {data: schoolData}) {
  return (
    <>
        <h1 className={css({
            fontSize: "4xl",
            fontWeight: "bold",
            color: "text",
          })}>School Name: {props.data.name}</h1>
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
          <CourseList />
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