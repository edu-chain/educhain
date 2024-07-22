import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";
import { useProgramProvider } from "~/app/context/blockchain";
import { useSessions } from "~/app/hooks/useSessions";
import Loading from "../loading";
import { hstack } from "styled-system/patterns";
import { useProgram } from "../solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { getAttendanceInfosFromStudentAndCourse, signAttendance } from "@api/educhain";
import { AttendanceAccountData, Infos } from "~/app/types/educhain";
import { Badge } from "~/components/ui/badge";

export function StudentCourseSessionsList() {

  const { GeneralContext } = useProgramProvider();
  const { selectedItems } = GeneralContext;

  const { sessions, isLoading} = useSessions(
    {type: "fromCourse", publicKey: selectedItems.course as PublicKey}
  );

  const [ attendances, setAttendances ] = useState<Infos<AttendanceAccountData | null>[]>([]);

  const program = useProgram();
  const wallet = useWallet();


  useEffect(() => {
    if (!selectedItems.course) return;
    getAttendanceInfosFromStudentAndCourse(
      program, 
      selectedItems.course as PublicKey, 
      wallet.publicKey as PublicKey
    )
    .then(attendances => {
      setAttendances(attendances);
    });
  }, []);

  const attendancePdaExist = (sessionPublicKey: PublicKey) => {
    return attendances.find(attendance => attendance.account?.session.toBase58() === sessionPublicKey.toBase58());
  }

  const handleSignAttendance = async (
    sessionPublicKey: PublicKey
  ) => {
    await signAttendance(
      program,
      selectedItems.course as PublicKey,
      sessionPublicKey,
      wallet
    );
  }

  if (isLoading) return <Loading />;

  return (
    <div className={css({
      maxHeight: "30vh",
      overflow: "auto",
    })}>
      <div>Sessions from {selectedItems.course?.toBase58()}</div>
      <div>
        { sessions?.map((session) => (
          <div className={hstack({
            p: 2,
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%"
          })} key={session.publicKey.toBase58()}>
            <div>{session.account.id?.toNumber()} - </div>
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