import { css } from "styled-system/css";
import { gridItem } from "styled-system/patterns";

import { useModalsProvider } from "~/app/context/modals";

export default function CourseCreate() {
  const { CreateCourseModalContext } = useModalsProvider()
  const { setOpen } = CreateCourseModalContext

  return (
    <div
      onClick={() => setOpen(true)}
      className={gridItem({
        colSpan: 1,
        rowSpan: 1,
        borderRadius: "md",
        overflow: "hidden",
        boxShadow: "md",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bg: "black",
        color: "white",
        _dark: { bg: "white", color: "black" },
        cursor: "pointer",
        transition: "all 0.2s",
        _hover: { transform: "scale(1.05)" },
      })}
  >
    <span
      className={css({
        fontSize: "4xl",
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
  );
}