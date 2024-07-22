'use client'

import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { hstack, grid } from "styled-system/patterns"
import { useProgramProvider } from '~/app/context/blockchain'
import Loading from '~/app/components/loading'
import { css } from 'styled-system/css'
import * as Card from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Book } from "lucide-react"
import EnrollCourseModal from '~/app/components/modals/enrollCourse'
import { useModalsProvider } from '~/app/context/modals'
import { PublicKey } from '@solana/web3.js'
import EnrollCourseCard from '~/app/components/cards/enrollCourseCard'

export default function CoursesPage() {
  const wallet = useWallet()
  const { CourseContext} = useProgramProvider()
  const { courses, isLoading, error } = CourseContext

  useEffect(() => {
    if (wallet.publicKey) {
      CourseContext.fetchAllCoursesExcludingStudentCourses(wallet.publicKey)
    }
  }, [wallet.publicKey])

  if (isLoading) return <Loading />
  if (error) return <div>Error: {error.toString()}</div>
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
        Courses
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
  )
}