import { useEffect, useState } from "react";
import { Infos, SchoolAccountData } from "~/app/types/educhain";
import { useProgram } from "../solana/solana-provider";

export default function useSchools() {
  const [schoolsList, setSchoolsList] = useState<Infos<SchoolAccountData>[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const program = useProgram();

  useEffect(() => {
    program.account.schoolDataAccount.all()
    .then((schools) => {
      setSchoolsList(schools);
    })
    .catch((error) => {
      setErrorMessage(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  });

  return { schoolsList, loading, errorMessage };
}