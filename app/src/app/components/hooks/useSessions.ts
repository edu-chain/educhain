import { useState, useEffect } from "react";
import { SessionAccountData, Infos } from "~/app/types/educhain";
import { useProgram } from "../solana/solana-provider";
import { PublicKey } from "@solana/web3.js";
import { getCoursesInfosFromStudent, getSessionsInfosFromCourse } from "@api/educhain";

type UseSessionsParams =
  | { type: 'all' }
  | { type: 'fromCourse', publicKey: PublicKey };

export default function useSessions(params: UseSessionsParams) {
  const [sessionsList, setSessionsList] = useState<Infos<SessionAccountData>[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const program = useProgram();

  useEffect(() => {
    let fetchCourses;

    switch (params.type) {
      case 'fromCourse':
        fetchCourses = getSessionsInfosFromCourse(program, params.publicKey);
        break;
      case 'all':
      default:
        fetchCourses = program.account.sessionDataAccount.all();
        break;
    }

    fetchCourses
      .then((courses) => {
        setSessionsList(courses as Infos<SessionAccountData>[]);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return { sessionsList, loading, errorMessage };
}