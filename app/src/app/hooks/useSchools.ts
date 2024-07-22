"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Infos, SchoolAccountData } from "~/app/types/educhain";
import { useProgram } from "../components/solana/solana-provider";
import { createSchoolDataAccount } from "@api/educhain";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getSchoolInfos } from "@api/educhain";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useState } from "react";

export function useSchools() {
  const queryClient = useQueryClient();
  const program = useProgram();
  const wallet = useWallet();
  const {connection} = useConnection();
  const [currentSchool, setCurrentSchool] = useState<Infos<SchoolAccountData> | null>(null);

  const schoolsQuery = useQuery({
    queryKey: ["schools"],
    queryFn: () => program.account.schoolDataAccount.all(),
    enabled: !!program,
  });

  const createSchoolMutation = useMutation({
    mutationFn: (schoolName: string) => createSchoolDataAccount(program, wallet, schoolName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
    },
  });

  const fetchSchoolByOwner = async (ownerPublicKey: PublicKey) => {
    const schoolInfo = await getSchoolInfos(program, ownerPublicKey);
    setCurrentSchool(schoolInfo);
    return schoolInfo;
  };

  const getBalance = async (schoolAddress: PublicKey) => {
    const balance = await connection.getBalance(schoolAddress);
    return balance / LAMPORTS_PER_SOL;
  };

  const withdrawal = async (schoolAddress: PublicKey) => {
    // Implement withdrawal logic here
    // This should call the withdrawal function from your Solana program
  };

  return {
    schools: schoolsQuery.data,
    currentSchool,
    isLoading: schoolsQuery.isLoading,
    error: schoolsQuery.error,
    createSchool: createSchoolMutation.mutate,
    fetchSchoolByOwner,
    getBalance,
    withdrawal,
  };
}