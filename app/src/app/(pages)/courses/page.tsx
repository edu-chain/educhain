'use client'

import { center } from "styled-system/patterns";
import { css } from "styled-system/css";

import Divider from "~/app/components/divider";
import CoursesList from "~/app/components/lists/coursesList";

export default function CoursesPage() {

  return (
    <div className={css({ p: 6})}>
      <h1 className={center({
            fontSize: '4xl',
            fontWeight: "bold",
            color: "primary",
          })}>Courses</h1>
      <Divider />
      <CoursesList />
    </div>
  );
}