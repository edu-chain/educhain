"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Infos, SchoolAccountData } from "~/app/types/educhain";
import { useProgram } from "../components/solana/solana-provider";
import { createSchoolDataAccount } from "@api/educhain";
import { useWallet } from "@solana/wallet-adapter-react";
import { getSchoolInfos } from "@api/educhain";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";

export function useSchools() {
  const queryClient = useQueryClient();
  const program = useProgram();
  const wallet = useWallet();
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
    return 0; // Placeholder
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