"use client"

import React, { useEffect } from 'react';
import { css } from "styled-system/css";
import Link from 'next/link';
import SessionMap from '~/app/components/sessionsMap';
import { Button } from '~/components/ui/button';
import { SessionStatus } from '~/app/types/all';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useProgram } from '~/app/components/solana/solana-provider';
import { PublicKey } from '@solana/web3.js';
import { createSessionDataAccount, getCourseInfos } from '@api/educhain';
import { CourseData, Infos, SessionData } from '~/app/types/educhain';
import Divider from '~/app/components/divider';
import * as Table from '~/components/ui/table';
import { useForm } from 'react-hook-form';
import { BN } from '@coral-xyz/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

type Session = {
  id: string;
  name: string;
  status: SessionStatus;
};

type Course = {
  id: string;
  name: string;
  sessions: Session[];
};

const courseData: Course = {
  id: '1',
  name: 'Introduction to Computer Science',
  sessions: [
    { id: '1', name: 'Fundamentals of Programming', status: 'validated' },
    { id: '2', name: 'Data Structures', status: 'in_progress' },
    { id: '3', name: 'Algorithms', status: 'locked' },
    { id: '4', name: 'Object-Oriented Programming', status: 'locked' },
  ]
};

function MockCourse() {
  return (
    <div className={css({ p: 6 })}>
      <h1
        className={css({
          fontSize: "3xl",
          fontWeight: "bold",
          mb: 6,
          color: "gray.800",
          _dark: { color: "white" },
        })}
      >
        {courseData.name}
      </h1>

      <SessionMap sessions={courseData.sessions} />

      <div
        className={css({ position: "fixed", bottom: "24px", right: "24px" })}
      >
        <Link href={`/course/${courseData.id}/create-groups`}>
          <Button
            variant="outline"
            size="lg">
            Create Groups
          </Button>
        </Link>
        </div>
      </div>
  )
}

function SessionsTable() {
  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Session Name</Table.Header>
          <Table.Header>Date</Table.Header>
          <Table.Header>Hour</Table.Header>
          <Table.Header>Duration</Table.Header>
          <Table.Header>Status</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {courseData.sessions.map((session) => (
          <Table.Row key={session.id}>
            <Table.Cell>{session.name}</Table.Cell>
            <Table.Cell><input type="date" /></Table.Cell>
            <Table.Cell><input type="time" /></Table.Cell>
            <Table.Cell><input type="number" /></Table.Cell>
            <Table.Cell>{session.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
function CourseContent(course: Infos<CourseData>) {
  return (
    <div className={css({ p: 6 })}>
      <h1
        className={css({
          fontSize: "3xl",
          fontWeight: "bold",
          mb: 6,
          color: "gray.800",
          _dark: { color: "white" },
        })}
      >
        {course.account.name}
      </h1>
      <SessionsTable />
      <Divider />
      <h3>Create Session</h3>
      <CreateSession {...course} />
    </div>
  )
}

type SessionForm = {
  name: string;
  date: string;
  hour: string;
  duration: number;
}

function CreateSession(course: Infos<CourseData>) {
  
  const program = useProgram();
  const wallet = useWallet();

  const onSubmit = async (data: SessionForm) => {

    const start = new Date(data.date + 'T' + data.hour);
    const end = new Date(start.getTime() + data.duration * 60 * 1000);

    const session: SessionData = {
      course: course.publicKey,
      start: new BN(start.getTime()),
      end: new BN(end.getTime()),
    }

    if (!course.account.school) {
      console.error("School address not found");
      return;
    }

    await createSessionDataAccount(
      program,
      wallet,
      session,
      course.publicKey,
      course.account.school
    );
  }

  const { register, handleSubmit } = useForm<SessionForm>({
    defaultValues: {
      name: '',
      date: '',
      hour: '',
      duration: 0,
    }
  })


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <Table.Root>
      <Table.Body>
        <Table.Row>
          <Table.Cell><input type="text" placeholder="Name" {...register('name')} /></Table.Cell>
          <Table.Cell><input type="date" placeholder="Date" {...register('date')} /></Table.Cell>
          <Table.Cell><input type="time" placeholder="Time" {...register('hour')} /></Table.Cell>
          <Table.Cell><input type="number" placeholder="Duration (minutes)" {...register('duration')} /></Table.Cell>
          <Table.Cell><Button type="submit">Create Session</Button></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
    </form>
  )
}


function CoursePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [course, setCourse] = useState<Infos<CourseData> | null>(null);

  const { slug } = useParams();

  const program = useProgram();

  useEffect(() => {
    const fetchCourse = async () => {
      const course = await getCourseInfos(
        program,
        new PublicKey(slug)
      );
      setCourse(course);
    }
    fetchCourse();
  }, [slug]);


  return (
    course ? (
      <>
        <MockCourse />
        <Divider />
        <CourseContent {...course} />
      </>
    ) : (
      <div>Loading...</div>
    )
  );
}
export default CoursePage;
