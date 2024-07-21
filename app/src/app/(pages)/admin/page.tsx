'use client';

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SchoolAccountData } from "~/app/types/educhain";

import { vstack, grid, hstack } from "styled-system/patterns";
import { css } from "styled-system/css";

import { useModalsProvider } from "~/app/context/modals";
import CreateSchoolModal from "~/app/components/modals/createSchool";
import CreateCourseModal from "~/app/components/modals/createCourse";
import CourseCreate from "~/app/components/cards/courseCreateCard";
import AdminCoursesList from "~/app/components/lists/adminCoursesList";
import { School } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Loading from "~/app/components/loading";
import { useProgramProvider } from "~/app/context/blockchain";

function SchoolCreate() {
  const { CreateSchoolModalContext } = useModalsProvider();
  const { setOpen } = CreateSchoolModalContext;

  return (
    <div
      className={vstack({
        gap: "20",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      })}
    >
      <h1
        className={css({
          fontSize: "4xl",
          fontWeight: "bold",
          color: "text",
        })}
      >
        {"Ce compte n'a pas d'école associée"}
      </h1>
      <Button margin="10%" onClick={() => setOpen(true)} size={"2xl"}>
        Créer une école
        <School />
      </Button>
      <CreateSchoolModal />
    </div>
  );
}

function SchoolData(
  { schoolData, schoolAddress }:
  { schoolData: SchoolAccountData, schoolAddress: PublicKey }
) {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const wallet = useWallet();
  const { SchoolContext } = useProgramProvider();

  const fetchBalance = async () => {
    // Implement getBalance in the context if needed
    const balance = await SchoolContext.getBalance(schoolAddress);
    setBalance(Number(balance.toFixed(2)));
  };

  const handleWithdrawal = async () => {
    await SchoolContext.withdrawal(schoolAddress);
  };

  useEffect(() => {
    const mount = async () => {
      await fetchBalance();
      setIsLoading(false);
    };
    mount();
  }, [schoolAddress]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div
            className={hstack({
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "100%",
            })}
          >
            <h1
              className={css({
                fontSize: "4xl",
                fontWeight: "bold",
                color: "text",
              })}
            >
              {schoolData.name}
            </h1>
            {balance > 0 ? (
              <Badge
                size="lg"
                variant="solid"
                onClick={balance > 0 ? handleWithdrawal : undefined}
                className={css({
                  cursor: "pointer",
                  _hover: {
                    bg: "purple",
                    transform: "scale(1.1)",
                  },
                })}
              >
                Withdrawal: {balance.toFixed(2)} SOL
              </Badge>
            ) : (
              <Badge size="lg" variant="outline">
                No revenue to withdraw
              </Badge>
            )}
          </div>
          <p
            className={css({
              fontSize: "xl",
              fontWeight: "bold",
              color: "text",
            })}
          >
            {schoolAddress.toBase58()}
          </p>
          <hr
            className={css({
              width: "100%",
              height: "5px",
              backgroundColor: "ui.background",
              border: "none",
              margin: "10px 0",
            })}
          />
          <div
            className={grid({
              gap: 6,
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
              gridAutoRows: "minmax(300px, 1fr)",
            })}
          >
            <AdminCoursesList schoolAddress={schoolAddress} />
            <CourseCreate />
          </div>
        </>
      )}
      <CreateCourseModal />
    </>
  );
}

function SchoolPage() {
  const wallet = useWallet();
  const { SchoolContext, CourseContext } = useProgramProvider();

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (wallet.publicKey) {
        await SchoolContext.fetchSchoolByOwner(wallet.publicKey);
      }
    };
    fetchSchoolData();
  }, [wallet.publicKey]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (SchoolContext.currentSchool) {
        await CourseContext.fetchCoursesBySchool(SchoolContext.currentSchool.publicKey);
      }
    };
    fetchCourses();
  }, [SchoolContext.currentSchool]);

  if (SchoolContext.isLoading) return <Loading />;

  return (
    <div className={css({ p: 6 })}>
      {SchoolContext.currentSchool ? (
        <SchoolData
          schoolData={SchoolContext.currentSchool.account}
          schoolAddress={SchoolContext.currentSchool.publicKey}
        />
      ) : (
        <SchoolCreate />
      )}
    </div>
  );
}

export default SchoolPage;