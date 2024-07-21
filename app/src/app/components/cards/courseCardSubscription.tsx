'use client'

import { useEffect, useState } from 'react'
import { Infos, CourseData } from '~/app/types/educhain'
import { ProgramAccount } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { useProgramProvider } from '~/app/context/blockchain'

type CourseType = Infos<CourseData> | ProgramAccount<{
  id: BN;
  school: PublicKey;
  schoolOwner: PublicKey;
  name: string;
  admins: PublicKey[];
  sessionsCounter: BN;
  groupsCounter: BN;
}>

type CourseCardProps = {
  coursePublicKey: PublicKey
}

export default function CourseCardSubscription({ coursePublicKey }: CourseCardProps) {
  const { CourseContext } = useProgramProvider()
  const { courses } = CourseContext
  const [course, setCourse] = useState<CourseType | null>(null)

  useEffect(() => {
    const foundCourse = courses?.find(c => c.publicKey.equals(coursePublicKey))
    if (foundCourse) {
      setCourse(foundCourse)
    }
  }, [courses, coursePublicKey])

  if (!course) {
    return <div>Loading course...</div>
  }

  const { name, school, sessionsCounter } = course.account

  return (
    <div>
      <h3>{name}</h3>
      <p>School: {school?.toString()}</p>
      <p>Sessions: {sessionsCounter?.toString()}</p>
      {/* Add more course details as needed */}
    </div>
  )
}