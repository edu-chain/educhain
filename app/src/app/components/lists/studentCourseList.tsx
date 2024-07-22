'use client'

import { useEffect } from "react";
import Loading from "~/app/components/loading";
import { useProgramProvider } from "~/app/context/blockchain";
import { useWallet } from "@solana/wallet-adapter-react";
import * as Accordion from "~/components/ui/accordion"
import { ChevronDownIcon } from "lucide-react"
import { StudentCourseSessionsList } from "./studentCourseSessionsList";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { css } from "styled-system/css";

export default function StudentCourseList() {
  const wallet = useWallet();
  const { CourseContext, GeneralContext } = useProgramProvider();
  const { courses, isLoading, error, selectCourse } = CourseContext;
  const { selectedItems } = GeneralContext;
  const router = useRouter();

  useEffect(() => {
    if (wallet.publicKey) {
      selectCourse(null); // Reset course selection when the component mounts
    }
  }, [wallet.publicKey]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <>
      {courses && courses.length > 0 ? (
        <Accordion.Root>
          {courses.map((course) => (
            <Accordion.Item
              key={course.publicKey.toBase58()}
              value={course.publicKey.toBase58()}
            >
              <Accordion.ItemTrigger onClick={() => selectCourse(course.publicKey)}>
                {course.account.name}
                <Accordion.ItemIndicator>
                  <ChevronDownIcon />
                </Accordion.ItemIndicator>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <p>School: {course?.account?.school?.toString()}</p>
                <p>Sessions: {course?.account?.sessionsCounter?.toString()}</p>
                {selectedItems.course === course.publicKey && (
                  <StudentCourseSessionsList />
                )}
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ) : (
        <div className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        })}>
          <h2 className={css({
            fontSize: '2xl',
            fontWeight: 'bold',
            marginBottom: '4',
          })}>
            {"You haven't enrolled in any courses yet"}
          </h2>
        </div>
      )}
      <div className={css({
        position: 'fixed',
        bottom: '24px',
        right: '24px',
      })}>
        <Button onClick={() => router.push('/courses')} size="lg">
          Find New Courses
        </Button>
      </div>
    </>
  );
}