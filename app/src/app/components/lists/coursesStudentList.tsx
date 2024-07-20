'use client'

import useCourses from "~/app/components/hooks/useCourses";
import Loading from "~/app/components/loading";
import { grid, hstack } from "styled-system/patterns";
import CourseCardSubscription from "../cards/courseCardSubscription";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import * as Accordion from "~/components/ui/accordion";
import { ChevronDownIcon } from "lucide-react";
import { css } from "styled-system/css";
import useSessions from "../hooks/useSessions";
import {
  getAttendanceInfosFromStudentAndCourse,
  signAttendance
} from "@api/educhain";
import { useProgram } from "../solana/solana-provider";
import { useEffect, useState } from "react";
import { AttendanceAccountData, Infos } from "~/app/types/educhain";
import * as Table from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

function SessionsList({coursePublicKey}: {coursePublicKey: PublicKey}) {

  const { sessionsList, loading, errorMessage } = useSessions({type: "fromCourse", publicKey: coursePublicKey});
  const [ attendances, setAttendances ] = useState<Infos<AttendanceAccountData | null>[]>([]);

  const program = useProgram();
  const wallet = useWallet();

  useEffect(() => {
    getAttendanceInfosFromStudentAndCourse(program, coursePublicKey, wallet.publicKey as PublicKey)
    .then(attendances => {
      setAttendances(attendances);
    });
  }, [program, coursePublicKey, wallet.publicKey]);

  const attendancePdaExist = (sessionPublicKey: PublicKey) => {
    return attendances.find(attendance => attendance.account?.session.toBase58() === sessionPublicKey.toBase58());
  }

  const handleSignAttendance = async (
    sessionPublicKey: PublicKey
  ) => {
    await signAttendance(
      program,
      coursePublicKey,
      sessionPublicKey,
      wallet
    );
  }

  return (
    <div className={css({
      maxHeight: "30vh",
      overflow: "auto",
    })}>
      <div>
        { sessionsList.map((session) => (
          <div className={hstack({
            p: 2,
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%"
          })} key={session.publicKey.toBase58()}>
            <div>{session.account.id.toNumber()} - </div>
            <div>{new Date(session.account.start.toNumber()).toLocaleDateString()} - </div>
            <div>{new Date(session.account.start.toNumber()).toLocaleTimeString()}</div>
            {
              attendancePdaExist(session.publicKey) ?
              <Badge className={css({
                ml: "auto",
                bg: "lightgreen"
              })}>Signed</Badge>
            :
              <Badge 
                className={css({
                  ml: "auto",
                  _hover: {
                    cursor: "pointer",
                    backgroundColor: "lemonchiffon",
                    scale: "1.05"
                  }
                })}
                onClick={() => handleSignAttendance(session.publicKey)}
              >Sign Attendance</Badge>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoursesStudentList() {

  const wallet = useWallet();

  const { coursesList, loading, errorMessage } = useCourses(
    {type: "fromStudent", publicKey: wallet.publicKey as PublicKey}
  );

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <>
    {
      loading ?
        <Loading />
      :
      <Accordion.Root>
        {coursesList.map((course) => (
        <Accordion.Item key={course.publicKey.toBase58()} value={course.publicKey.toBase58()}>
          <Accordion.ItemTrigger>
            {course.account.name}
            <Accordion.ItemIndicator>
              <ChevronDownIcon />
            </Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <SessionsList coursePublicKey={course.publicKey} />
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
      </Accordion.Root>
    }
    </>
  );
}