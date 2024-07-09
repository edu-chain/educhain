"use client"
import React from 'react';
import { css } from "styled-system/css";
import { vstack, hstack } from "styled-system/patterns";
import Link from 'next/link';
import SessionMap from '~/app/components/sessionsMap';
import { Button } from '~/components/ui/button';
import { SessionStatus } from '~/app/types/all';
import { useState } from 'react';

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


function CoursePage() {
  const [isAdmin, setIsAdmin] = useState(false);

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
  );
}
export default CoursePage;
