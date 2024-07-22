'use client'

import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { grid, hstack } from "styled-system/patterns"
import { useProgramProvider } from '~/app/context/blockchain'
import Loading from '~/app/components/loading'
import { css } from 'styled-system/css'
import * as Card from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Book } from "lucide-react"
import { useParams } from 'next/navigation'
import { PublicKey } from '@solana/web3.js'
import EnrollCourseCard from '~/app/components/cards/enrollCourseCard'
import EnrollCourseModal from '~/app/components/modals/enrollCourse'

export default function SchoolCoursesPage() {
  const wallet = useWallet()
  const { CourseContext } = useProgramProvider()
  const { courses, isLoading: coursesLoading, error: coursesError, fetchCoursesBySchool } = CourseContext
  const params = useParams()
  const schoolId = params.schoolId as string

  useEffect(() => {
    console.log(wallet.publicKey && schoolId);
    if (wallet.publicKey && schoolId) {
      fetchCoursesBySchool(new PublicKey(schoolId));
    }
  }, [wallet.publicKey, schoolId])

  if (coursesLoading) return <Loading />
  if (coursesError) return <div>Error loading courses: {coursesError.toString()}</div>
  if (!wallet.publicKey) return <div>Please connect your wallet</div>

  return (
    <div className={css({ p: 6, bg: "gray.50", minHeight: "100vh" })}>
      <h1
        className={css({
          fontSize: "3xl",
          fontWeight: "bold",
          mb: 6,
          color: "gray.800",
        })}
      >
        Courses for {schoolId}
      </h1>
      <div
        className={grid({
          gap: 6,
          gridTemplateColumns: {
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        })}
      >
        {courses?.map((course) => (
          <EnrollCourseCard course={course} key={course.publicKey.toString()} />
        ))}
      </div>
      <EnrollCourseModal />
    </div>
  );
}