"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgramProvider } from "~/app/context/blockchain";
import StudentCourseList from "~/app/components/lists/studentCourseList";
import Loading from "~/app/components/loading";

export default function StudentPage() {
  const wallet = useWallet();
  const { CourseContext, GeneralContext } = useProgramProvider();
  const { isLoading, error } = CourseContext;
  const { selectedItems } = GeneralContext;

  useEffect(() => {
    if (wallet.publicKey) {
      CourseContext.selectCourse(null); // Reset course selection when the page loads
    }
  }, [wallet.publicKey]);

  if (!wallet.publicKey) return <div>Please connect your wallet</div>;
  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      <StudentCourseList />
      {selectedItems.course && (
        <div>
          <h2>Selected Course: {selectedItems.course.toString()}</h2>
          {/* You can add more details about the selected course here */}
        </div>
      )}
    </div>
  );
}
