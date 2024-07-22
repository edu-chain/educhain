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

export default function CoursesPage() {
  const wallet = useWallet()
  const { CourseContext } = useProgramProvider()
  const { courses, isLoading, error, enrollCourse } = CourseContext

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
          <Card.Root key={course.publicKey.toString()}>
            <Card.Header>
              <Card.Title className={hstack({ gap: 2, alignItems: "center" })}>
                <Book
                  className={css({ color: "blue.500", width: 6, height: 6 })}
                />
                {course.account.name}
                <div className={css({ marginLeft: "auto" })}>
                  <Badge
                    variant="outline"
                    size="lg"
                    onClick={() => enrollCourse(course.publicKey)}
                    className={css({
                      cursor: "pointer",
                      "&:hover": {
                        bg: "lightyellow",
                      },
                    })}
                  >
                    Enroll
                  </Badge>
                </div>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Badge
                variant="outline"
                className={css({ alignSelf: "flex-start" })}
              >
                {course.account.sessionsCounter?.toString() || "0"} sessions
              </Badge>
              <div
                className={css({
                  fontSize: "sm",
                  color: "gray.600",
                  wordBreak: "break-all",
                  mt: 2,
                })}
              >
                School: {course.account.school?.toString() || "Unknown"}
              </div>
            </Card.Body>
          </Card.Root>
        ))}
      </div>
    </div>
  )
}