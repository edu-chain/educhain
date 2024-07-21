"use client"
import React, { useState, useEffect } from "react";
import { Container } from 'styled-system/jsx'
import { Button } from '~/components/ui/button'
import { css } from "styled-system/css";
import CreateCourseModal from "./components/modals/createCourse";
import { useRouter } from "next/navigation";
import { useWallet } from '@solana/wallet-adapter-react'

export default function Home() {

  const wallet = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (wallet.connected) {
      router.push('/schools');
    }
  }, [wallet?.connected, router]);

  return (
    <Container
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      })}
      maxW="7xl"
    >
      {!wallet?.connected && (
        <p>Please connect your wallet to access the schools page.</p>
      )}
    </Container>
  );
}
