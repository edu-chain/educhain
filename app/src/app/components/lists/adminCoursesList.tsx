'use client'

import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { getCoursesInfos } from "@api/educhain";
import { CourseData, Infos } from "~/app/types/educhain";

import { useProgram } from "~/app/components/solana/solana-provider";
import AdminCourseCard from "~/app/components/cards/adminCourseCard";
import Loading from "~/app/components/loading";

export default function AdminCoursesList({schoolAddress}: {schoolAddress: PublicKey}) {

  const program = useProgram();
  const [courses, setCourses] = useState<Infos<CourseData>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getCoursesInfos(program, schoolAddress);
      setCourses(courses);
      setIsLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <>
    {
    isLoading ?
    <Loading />
      : 
      <> {
        courses.map((course, index) => (
          <AdminCourseCard key={index} {...course} />
        ))}
      </>
    }
    </>
  );
}