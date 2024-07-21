'use client'

import { useEffect } from "react";
import Loading from "~/app/components/loading";
import { useProgramProvider } from "~/app/context/blockchain";
import { useWallet } from "@solana/wallet-adapter-react";
import * as Accordion from "~/components/ui/accordion"
import { ChevronDownIcon } from "lucide-react"

export default function StudentCourseList() {
  const wallet = useWallet();
  const { CourseContext } = useProgramProvider();
  const { courses, isLoading, error, selectCourse } = CourseContext;

  useEffect(() => {
    if (wallet.publicKey) {
      selectCourse(null); // Reset course selection when the component mounts
    }
  }, [wallet.publicKey, selectCourse]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.toString()}</div>;


  return (
    <Accordion.Root>
      {courses?.map((course) => (
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
            {/* You can add more course details here if needed */}
            <p>School: {course?.account?.school?.toString()}</p>
            <p>Sessions: {course?.account?.sessionsCounter?.toString()}</p>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}