'use client'

import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useProgramProvider } from "~/app/context/blockchain";
import Loading from "~/app/components/loading";
import AdminCourseCard from "~/app/components/cards/adminCourseCard";

export default function AdminCoursesList({schoolAddress}: {schoolAddress: PublicKey}) {
  const { CourseContext } = useProgramProvider();
  const { courses, isLoading, error } = CourseContext;

  useEffect(() => {
    CourseContext.selectCourse(schoolAddress);
  }, [schoolAddress]);

  if (error) {
    return <div>{error.toString()}</div>;
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {" "}
          {courses?.map((course, index) => (
            <AdminCourseCard key={index} {...course} />
          ))}
        </>
      )}
    </>
  );
}