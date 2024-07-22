"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "../components/solana/solana-provider";
import { getSessionsInfosFromCourse, createSessionDataAccount } from "@api/educhain";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { SessionData } from "~/app/types/educhain";

export type UseSessionsParams =
  | { type: 'all' }
  | { type: 'fromCourse', publicKey: PublicKey }


export function useSessions(params: UseSessionsParams) {
  const queryClient = useQueryClient();
  const program = useProgram();
  const wallet = useWallet();

  const sessionsQuery = useQuery({
    queryKey: ['sessions', params.type, 'publicKey' in params ? params.publicKey.toString() : undefined],
    queryFn: async () => {
      switch (params.type) {
        case 'fromCourse':
          return await getSessionsInfosFromCourse(program, params.publicKey)
        case 'all':
        default:
          return await program.account.sessionDataAccount.all()
      }
    },
    enabled: !!program,
  });

  const createSessionMutation = useMutation({
    mutationFn: (newSession: { sessionData: SessionData, courseAddress: PublicKey, schoolAddress: PublicKey }) => 
      createSessionDataAccount(program, wallet, newSession.sessionData, newSession.courseAddress, newSession.schoolAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  const fetchSessionsByCourse = async (courseAddress: PublicKey) => {
    const sessions = await getSessionsInfosFromCourse(program, courseAddress)
    queryClient.setQueryData(['sessions', courseAddress.toString()], sessions)
    return sessions
  }

  return {
    sessions: sessionsQuery.data,
    isLoading: sessionsQuery.isLoading,
    error: sessionsQuery.error,
    createSession: createSessionMutation.mutate,
    fetchSessionsByCourse,
  };
}