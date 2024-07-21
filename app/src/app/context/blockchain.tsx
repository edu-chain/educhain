'use client'

import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react'
import { useCourses, UseCoursesParams } from '../hooks/useCourses'
import { useSchools } from '../hooks/useSchools'
import { useSessions } from '../hooks/useSessions'
import { CourseData, SchoolAccountData, SessionData, Infos } from '~/app/types/educhain'
import { PublicKey } from "@solana/web3.js"
import { useQueryClient } from '@tanstack/react-query'

type IItems = {
  school: PublicKey | null
  course: PublicKey | null
  session: PublicKey | null
}

type ItemType = 'Session' | 'Course' | 'School' | undefined

interface IGeneral {
  selectedItems: IItems
  currentItemType: ItemType
}

interface ISchool {
  schools: Infos<SchoolAccountData>[] | undefined
  currentSchool: Infos<SchoolAccountData> | null
  isLoading: boolean
  error: unknown
  createSchool: (schoolName: string) => void
  fetchSchoolByOwner: (ownerPublicKey: PublicKey) => Promise<Infos<SchoolAccountData> | null>
  getBalance: (schoolAddress: PublicKey) => Promise<number>
  withdrawal: (schoolAddress: PublicKey) => Promise<void>
  selectSchool: (school: PublicKey | null) => void
}

interface ICourse {
  courses: Infos<CourseData>[] | undefined
  isLoading: boolean
  error: unknown
  createCourse: (courseData: CourseData) => void
  fetchCoursesBySchool: (schoolAddress: PublicKey) => Promise<void>
  selectCourse: (course: PublicKey | null) => void
}

interface ISession {
  sessions: Infos<SessionData>[] | undefined
  isLoading: boolean
  error: unknown
  createSession: (newSession: { sessionData: SessionData, courseAddress: PublicKey, schoolAddress: PublicKey }) => void
  fetchSessionsByCourse: (courseAddress: PublicKey) => Promise<void>
  selectSession: (session: PublicKey | null) => void
}

type ProgramContextType = {
  SchoolContext: ISchool
  CourseContext: ICourse
  SessionContext: ISession
  GeneralContext: IGeneral
}

const ProgramProviderContext = createContext<ProgramContextType | null>(null)

export const ProgramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSchool, setSelectedSchool] = useState<PublicKey | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<PublicKey | null>(null)
  const [selectedSession, setSelectedSession] = useState<PublicKey | null>(null)
  const [currentItemType, setCurrentItemType] = useState<ItemType>()

  const queryClient = useQueryClient()
  const schoolsResult = useSchools()
  const [coursesParams, setCoursesParams] = useState<UseCoursesParams>({ type: 'all' })
  const coursesResult = useCourses(coursesParams)
  const sessionsResult = useSessions()

  const selectSchool = useCallback((school: PublicKey | null) => {
    setSelectedCourse(null)
    setSelectedSession(null)
    setSelectedSchool(school)
    setCurrentItemType('School')
  }, [])

  const selectCourse = useCallback((course: PublicKey | null) => {
    setSelectedSession(null)
    setSelectedCourse(course)
    setCurrentItemType(course ? 'Course' : 'School')
  }, [])

  const selectSession = useCallback((session: PublicKey | null) => {
    setSelectedSession(session)
    if (session) {
      setCurrentItemType('Session')
    }
  }, [])

  const fetchCoursesBySchool = useCallback(async (schoolAddress: PublicKey) => {
    setCoursesParams({ type: 'fromSchool', publicKey: schoolAddress })
    await coursesResult.fetchCoursesBySchool(schoolAddress)
  }, [coursesResult])

  const fetchSessionsByCourse = useCallback(async (courseAddress: PublicKey) => {
    await sessionsResult.fetchSessionsByCourse(courseAddress)
  }, [sessionsResult])

  const value: ProgramContextType = {
    SchoolContext: {
      ...schoolsResult,
      selectSchool,
    },
    CourseContext: {
      ...coursesResult,
      selectCourse,
      fetchCoursesBySchool,
    },
    SessionContext: {
      ...sessionsResult,
      selectSession,
      fetchSessionsByCourse,
    },
    GeneralContext: {
      selectedItems: {
        school: selectedSchool,
        course: selectedCourse,
        session: selectedSession,
      },
      currentItemType,
    },
  }

  return (
    <ProgramProviderContext.Provider value={value}>
      {children}
    </ProgramProviderContext.Provider>
  )
}

export const useProgramProvider = (): ProgramContextType => {
  const context = useContext(ProgramProviderContext)
  if (!context) {
    throw new Error('useProgramProvider must be used within a ProgramProvider')
  }
  return context
}