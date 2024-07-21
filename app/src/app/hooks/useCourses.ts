'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseAccountData, Infos, CourseData, SessionData } from "~/app/types/educhain";
import { useProgram } from "../components/solana/solana-provider";
import { PublicKey } from "@solana/web3.js";
import {
  getCoursesInfosFromStudent,
  createCourseDataAccount,
  getSessionsInfosFromCourse,
  createSessionDataAccount,
  getCoursesInfosFromSchool,
} from "@api/educhain";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback } from "react";

export type UseCoursesParams =
  | { type: 'all' }
  | { type: 'fromSchool', publicKey: PublicKey }
  | { type: 'fromStudent', publicKey: PublicKey };

export function useCourses(params: UseCoursesParams) {
  const queryClient = useQueryClient()
  const program = useProgram();
  const wallet = useWallet();

   const coursesQuery = useQuery({
     queryKey: ['courses', params.type, 'publicKey' in params ? params.publicKey.toString() : undefined],
     queryFn: async () => {
       switch (params.type) {
         case 'fromSchool':
           return getCoursesInfosFromSchool(program, params.publicKey);
         case 'fromStudent':
           return getCoursesInfosFromStudent(program, params.publicKey);
         case 'all':
         default:
           return program.account.courseDataAccount.all();
       }
     },
     enabled: !!program,
   });

   const fetchCoursesBySchool = useCallback(
     async (schoolAddress: PublicKey) => {
       const courses = await getCoursesInfosFromSchool(program, schoolAddress);
       queryClient.setQueryData(["courses", schoolAddress.toString()], courses);
     },
     [program, queryClient]
   );

   const createCourseMutation = useMutation({
     mutationFn: (courseData: CourseData) =>
       createCourseDataAccount(program, wallet, courseData),
     onSuccess: () => {
       queryClient.invalidateQueries({queryKey: ["courses"]});
     },
   });

   const fetchSessionsByCourse = useCallback(
     async (courseAddress: PublicKey) => {
       const sessions = await getSessionsInfosFromCourse(program, courseAddress);
       queryClient.setQueryData(["sessions", courseAddress.toString()], sessions);
     },
     [program, queryClient]
   );

   const createSessionMutation = useMutation({
     mutationFn: (newSession: { sessionData: SessionData, courseAddress: PublicKey, schoolAddress: PublicKey }) =>
       createSessionDataAccount(program, wallet, newSession.sessionData, newSession.courseAddress, newSession.schoolAddress),
     onSuccess: () => {
       queryClient.invalidateQueries({queryKey: ["sessions"]});
     },
   });

   return {
     courses: coursesQuery.data,
     isLoading: coursesQuery.isLoading,
     error: coursesQuery.error,
     createCourse: createCourseMutation.mutate,
     fetchCoursesBySchool,
     fetchSessionsByCourse,
     createSession: createSessionMutation.mutate,
   };
}