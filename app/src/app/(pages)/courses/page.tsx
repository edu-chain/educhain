'use client'

import { useState } from "react";
import { CourseAccountData, Infos, SchoolAccountData, StudentSubscriptionDataAccount } from "~/app/types/educhain";
import { useEffect } from "react";
import { useProgram } from "~/app/components/solana/solana-provider";
import { center, grid, gridItem, hstack, vstack } from "styled-system/patterns";
import Divider from "~/app/components/divider";
import { Badge } from "~/components/ui/badge";
import { PublicKey } from "@solana/web3.js";
import { getStudentSubscriptionInfos, subscribeToCourse } from "@api/educhain";
import { useWallet } from "@solana/wallet-adapter-react";
import { css } from "styled-system/css";

function CourseCard({ course }: { course: Infos<CourseAccountData> }) {

  const [school, setSchool] = useState<SchoolAccountData>();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [subscription, setSubscription] = useState<StudentSubscriptionDataAccount | null>(null);

  const program = useProgram();
  const wallet = useWallet();

  const fetchSubscription = async () => {
    const studentSubscription = await getStudentSubscriptionInfos(
      program,
      wallet.publicKey as PublicKey,
      course.publicKey
    );
    if (studentSubscription) {
      setSubscription(studentSubscription);
    }
  }

  const handleBuyCourse = async() => {
    const response = await subscribeToCourse(
      program,
      wallet,
      course.publicKey,
      "name of what?"
    );
    if (response) {
      await fetchSubscription();
    }
  };

  useEffect(() => {
    const fetchSchool = async () => {
      const _school = await program.account.schoolDataAccount.fetch(course.account.school);
      await fetchSubscription();
      if (_school) {
        setSchool(_school);
        setLoading(false);
      } else {
        setErrorMessage("School not found");
      }
    };
    fetchSchool();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className={gridItem({
      backgroundColor: 'lightgray',
    })}>
      <div className={vstack({
        alignItems: "center",
        justifyContent: "space-between",
      })}>
        <div className={center({
          fontSize: '2xl',
          fontWeight: "bold",
          color: "primary",
        })}>{course.account.name}</div>
        <div>{school?.name}</div>
        {
          subscription ?
          <Badge size="lg">Subscribed</Badge> :
          <Badge 
            onClick={handleBuyCourse} 
            size="lg"
            variant="solid"
            className={css({
              _hover: {
                cursor: "pointer",
                backgroundColor: "green",
                transform: "scale(1.1)" 
              }
            })}
          >
            Buy course (3 SOL)
          </Badge>
        }
      </div>
    </div>
  );
}

export default function CoursesPage() {

  const [coursesList, setCoursesList] = useState<Infos<CourseAccountData>[]>([]);
  const [loading, setLoading] = useState(true);

  const program = useProgram();

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await program.account.courseDataAccount.all();
      setCoursesList(courses);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1
        className={center({
          fontSize: '4xl',
          fontWeight: "bold",
          color: "primary",
        })}
      >Courses</h1>
      <Divider />
      <div
        className={grid({
          gap: 6,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
          gridAutoRows: "minmax(200px, 1fr)",
        })}
      >
        {coursesList.map((course) => <CourseCard key={course.publicKey.toBase58()} course={course} />)}
      </div>
    </div>
  );
}