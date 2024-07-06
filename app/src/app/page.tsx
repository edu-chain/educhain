"use client"
import React, { useState } from "react";
import { Container } from 'styled-system/jsx'
import { Button } from '~/components/ui/button'
import { useRouter } from 'next/navigation'
import { css } from "styled-system/css";
import CreateCourseModal from "./components/modals/createCourse";

export default function Home() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

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
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <CreateCourseModal open={open} onClose={() => setOpen(false)} />
    </Container>
  );
}
