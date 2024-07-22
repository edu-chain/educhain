'use client'

import { useEffect } from "react";
import Loading from "~/app/components/loading";
import { useProgramProvider } from "~/app/context/blockchain";
import { useWallet } from "@solana/wallet-adapter-react";
import * as Accordion from "~/components/ui/accordion"
import * as Card from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Avatar } from "~/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { StudentCourseSessionsList } from "./studentCourseSessionsList";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { css } from "styled-system/css";
import { School, Calendar, Users, ChevronRight } from "lucide-react"

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
    <div className={css({ padding: '4', margin: '0 auto' })}>
      {courses && courses.length > 0 ? (
        <Accordion.Root>
          {courses.map((course) => (
            <Accordion.Item key={course.publicKey.toBase58()} value={course.publicKey.toBase58()}>
              <Accordion.ItemTrigger
                onClick={() => selectCourse(course.publicKey)}
                className={css({
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '4',
                  fontSize: 'lg',
                  fontWeight: 'semibold',
                  borderBottom: '1px solid',
                  borderColor: 'gray.200',
                  _hover: { bg: 'gray.50' }
                })}
              >
                {course.account.name}
                <Accordion.ItemIndicator>
                  <ChevronDown className={css({ transition: 'transform 0.2s', '[data-state=open] &': { transform: 'rotate(180deg)' } })} />
                </Accordion.ItemIndicator>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Card.Root className={css({ padding: '4', margin: '2' })}>
                  <div className={css({ display: 'flex', alignItems: 'center', marginBottom: '4' })}>
                    <Avatar
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${course.account.name}`}
                      // fallback={course.account.name.substring(0, 2)}
                      className={css({ marginRight: '3' })}
                    />
                    <div>
                      <h3 className={css({ fontSize: 'xl', fontWeight: 'bold' })}>{course.account.name}</h3>
  
                    </div>
                  </div>
                  <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
                    <div className={css({ display: 'flex', alignItems: 'center' })}>
                      <School className={css({ marginRight: '2', color: 'gray.500' })} size={16} />
                      <span>{course?.account?.school?.toString()}</span>
                    </div>
                    <div className={css({ display: 'flex', alignItems: 'center' })}>
                      <Calendar className={css({ marginRight: '2', color: 'gray.500' })} size={16} />
                      <span>{course?.account?.sessionsCounter?.toString()} Sessions</span>
                    </div>
                    <div className={css({ display: 'flex', alignItems: 'center' })}>
                      <Users className={css({ marginRight: '2', color: 'gray.500' })} size={16} />
                      <span>{course?.account?.maxStudents?.toString() || 0} Students Max</span>
                    </div>
                  </div>
                  {selectedItems.course === course.publicKey && (
                    <div className={css({ marginTop: '4' })}>
                      <h4 className={css({ fontSize: 'lg', fontWeight: 'semibold', marginBottom: '2' })}>Course Sessions</h4>
                      <StudentCourseSessionsList />
                    </div>
                  )}
                  {/* <Button 
                    variant="outline" 
                    className={css({ marginTop: '4', width: '100%' })}
                    onClick={() => router.push(`/courses/${course.publicKey.toBase58()}`)}
                  >
                    View Course Details
                    <ChevronRight size={16} className={css({ marginLeft: '2' })} />
                  </Button> */}
                </Card.Root>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      ) : (
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          })}
        >
          <h2
            className={css({
              fontSize: "2xl",
              fontWeight: "bold",
              marginBottom: "4",
            })}
          >
            {"You haven't enrolled in any courses yet"}
          </h2>
        </div>
      )}
      <div
        className={css({
          position: "fixed",
          bottom: "24px",
          right: "24px",
        })}
      >
        <Button onClick={() => router.push("/courses")} size="lg">
          Find New Courses
        </Button>
      </div>
    </div>
  );
}