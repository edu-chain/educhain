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
import { getCourseInfos } from '@api/educhain';
import { CourseData, Infos } from '~/app/types/educhain';
import Divider from '~/app/components/divider';
import * as Table from '~/components/ui/table';

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
    </div>
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
