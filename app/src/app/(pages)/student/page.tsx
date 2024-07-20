'use client'

import React from 'react'
import { css } from "styled-system/css";
import { vstack } from "styled-system/patterns";
import Divider from '~/app/components/divider';
import CoursesStudentList from '~/app/components/lists/coursesStudentList';

// Mock data for courses (replace with actual data fetching logic)
const courses = [
  { courseName: "Mathematics", groupMembers: ["Alice", "Bob"], progress: 75 },
  { courseName: "Physics", groupMembers: ["Charlie", "David"], progress: 60 },
  { courseName: "Computer Science", groupMembers: ["Eve", "Frank"], progress: 90 },
];

function StudentDashboard() {

  return (
    <div className={vstack({ p: 6 })}>
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
          _dark: { color: "white" },
        })}
      >
        My Courses
      </h1>
      <Divider />
      <CoursesStudentList />
    </div>
  );
}

export default StudentDashboard