import { useState, useEffect } from "react";
import { CourseAccountData, Infos } from "~/app/types/educhain";
import { useProgram } from "../solana/solana-provider";
import { PublicKey } from "@solana/web3.js";
import { getCoursesInfosFromStudent } from "@api/educhain";

type UseCoursesParams =
  | { type: 'all' }
  | { type: 'fromSchool', publicKey: PublicKey }
  | { type: 'fromStudent', publicKey: PublicKey };

export default function useCourses(params: UseCoursesParams) {
  const [coursesList, setCoursesList] = useState<Infos<CourseAccountData>[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const program = useProgram();

  useEffect(() => {
    let fetchCourses;

    switch (params.type) {
      case 'fromSchool':
        // TODO: implement
        fetchCourses = program.account.courseDataAccount.all();
        break;
      case 'fromStudent':
        fetchCourses = getCoursesInfosFromStudent(program, params.publicKey);
        break;
      case 'all':
      default:
        fetchCourses = program.account.courseDataAccount.all();
        break;
    }

    fetchCourses
      .then((courses) => {
        setCoursesList(courses as Infos<CourseAccountData>[]);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  },[]);

  return { coursesList, loading, errorMessage };
}