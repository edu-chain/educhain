import React from 'react'
import CourseCard from '~/app/components/courseCard';
import { css } from "styled-system/css";
import { grid, gridItem } from "styled-system/patterns";
import Link from 'next/link';

// Mock data for courses (replace with actual data fetching logic)
const courses = [
  { courseName: "Mathematics", groupMembers: ["Alice", "Bob"], progress: 75 },
  { courseName: "Physics", groupMembers: ["Charlie", "David"], progress: 60 },
  { courseName: "Computer Science", groupMembers: ["Eve", "Frank"], progress: 90 },
];

function StudentDashboard() {
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
        My Courses
      </h1>
      <div
        className={grid({
          gap: 6,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
          gridAutoRows: "minmax(300px, 1fr)",
        })}
      >
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
        <Link href="/find-courses" className={css({ textDecoration: "none" })}>
          <div
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
              Find New Courses
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard