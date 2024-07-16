"use client"
import React from 'react'
import AdminCourseCard from '~/app/components/cards/adminCourseCard';
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";
import { useModalsProvider } from '~/app/context/modals'
import CreateCourseModal from '~/app/components/modals/createCourse'
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

// Mock data for courses (replace with actual data fetching logic)
const courses = [
  {
    publicKey: new PublicKey("AH71ahcm3SZaFkkZPYsdS1T2fs9PUikLSSSAhCU9iZAZ"),
    account: {
      id: new BN(1),
      school: new PublicKey("EKvs5tTo6K5RiwTiNqzo1zwKSA7iDdZrDmLpfShFzeyL"),
      schoolOwner: new PublicKey("wrkxrnzAL4ScwhVWncfbneKQLujTyiRiqnCVdcb3KC3"),
      name: "First Course",
      admins: [
        new PublicKey("wrkxrnzAL4ScwhVWncfbneKQLujTyiRiqnCVdcb3KC3")
      ],
      sessionsCounter: new BN(0),
      groupsCounter: new BN(0)
    }
  },
  {
    publicKey: new PublicKey("GuB5eAm2uvnyKmyAeb3zMypYX2e4EqVbARnUvSwzu598"),
    account: {
      id: new BN(2),
      school: new PublicKey("EKvs5tTo6K5RiwTiNqzo1zwKSA7iDdZrDmLpfShFzeyL"),
      schoolOwner: new PublicKey("wrkxrnzAL4ScwhVWncfbneKQLujTyiRiqnCVdcb3KC3"),
      name: "Second School",
      admins: [
        new PublicKey("wrkxrnzAL4ScwhVWncfbneKQLujTyiRiqnCVdcb3KC3")
      ],
      sessionsCounter: new BN(0),
      groupsCounter: new BN(0)
    }
  },
  {
    publicKey: new PublicKey("mjE8rzCMohaxWWCzSfXKvJyQwYqxKLy63gGadRrGg2t"),
    account: {
      id: new BN(3),
      school: new PublicKey("EKvs5tTo6K5RiwTiNqzo1zwKSA7iDdZrDmLpfShFzeyL"),
      schoolOwner: new PublicKey("wrkxrnzAL4ScwhVWncfbneKQLujTyiRiqnCVdcb3KC3"),
      name: "Third Course",
      admins: [
        new PublicKey("wrkxrnzAL4ScwhVWncfbneKQLujTyiRiqnCVdcb3KC3")
      ],
      sessionsCounter: new BN(0),
      groupsCounter: new BN(0)
    }
  }
];

// Mock school name (replace with actual data fetching logic)
const schoolName = "Acme University";

function AdminDashboard() {
  const { CreateCourseModalContext } = useModalsProvider()
  const { setOpen } = CreateCourseModalContext

  return (
    <div className={css({ p: 6 })}>
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
          mb: 6,
          color: "gray.800",
          _dark: { color: "white" },
        })}
      >
        {schoolName} Courses
      </h1>
      <div
        className={grid({
          gap: 6,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
          gridAutoRows: "minmax(300px, 1fr)",
        })}
      >
        {courses.map((course, index) => (
          <AdminCourseCard key={index} {...course} />
        ))}
        <div
          onClick={() => setOpen(true)}
          className={gridItem({
            colSpan: 1,
            rowSpan: 1,
            h: "full",
            borderRadius: "md",
            overflow: "hidden",
            boxShadow: "md",
            bg: "gray.100",
            _dark: { bg: "gray.700" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            _hover: { transform: "scale(1.05)" },
          })}
        >
          <span
            className={css({
              fontSize: "4xl",
              color: "blue.500",
              mb: 2,
            })}
          >
            +
          </span>
          <span
            className={css({
              fontSize: "xl",
              fontWeight: "bold",
              color: "gray.800",
              _dark: { color: "white" },
            })}
          >
            Create Course
          </span>
        </div>
      </div>
      <CreateCourseModal />
    </div>
  );
}

export default AdminDashboard
