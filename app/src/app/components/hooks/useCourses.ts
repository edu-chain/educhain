import { useState, useEffect } from "react";
import { CourseAccountData, Infos } from "~/app/types/educhain";
import { useProgram } from "../solana/solana-provider";


export default function useCourses() {
  const [coursesList, setCoursesList] = useState<Infos<CourseAccountData>[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const program = useProgram();

  useEffect(() => {
    program.account.courseDataAccount.all()
    .then((courses) => {
      setCoursesList(courses);
    })
    .catch((error) => {
      setErrorMessage(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  return { coursesList, loading, errorMessage };
}