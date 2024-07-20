import { Progress, type ProgressProps } from "~/components/ui/progress";
import React from "react";
import { css } from "styled-system/css";
import { gridItem, hstack } from "styled-system/patterns";

type Props = {
  courseName: string;

  groupMembers: string[];
  progress: number;
};

function CourseStudentCard(props: Props) {
  return (
    <div
      className={gridItem({
        colSpan: 1,
        rowSpan: 1,
        w: "full",
        borderRadius: "md",
        overflow: "hidden",
        boxShadow: "md",
        bg: "white",
        _dark: { bg: "gray.800" },
        cursor: "pointer",
        transition: "all 0.2s",
        _hover: { transform: "scale(1.05)" },
      })}
    >
      <div className={css({ p: 4 })}>
        <div className={hstack({ justifyContent: "space-between", mb: 4 })}>
          <h3
            className={css({
              fontSize: "xl",
              fontWeight: "bold",
              color: "gray.800",
              _dark: { color: "white" },
            })}
          >
            {props.courseName}
          </h3>
        </div>

        <div className={css({ mb: 4 })}>
          <h4
            className={css({
              fontSize: "md",
              fontWeight: "semibold",
              mb: 2,
              color: "gray.700",
              _dark: { color: "gray.300" },
            })}
          >
            Group Members:
          </h4>
          <ul className={css({ listStyleType: "none", pl: 0 })}>
            {props.groupMembers.map((member, index) => (
              <li
                key={index}
                className={css({
                  mb: 1,
                  color: "gray.600",
                  _dark: { color: "gray.400" },
                })}
              >
                {member}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span
            className={css({
              fontSize: "sm",
              fontWeight: "medium",
              color: "gray.700",
              _dark: { color: "gray.300" },
            })}
          >
            Progress
          </span>
          <Progress value={props.progress} min={0} max={100} />
          <div
            className={css({
              w: "full",
              bg: "gray.200",
              borderRadius: "full",
              overflow: "hidden",
              _dark: { bg: "gray.700" },
            })}
          >
            <div
              className={css({
                h: "8px",
                bg: "blue.500",
                borderRadius: "full",
                transition: "width 0.3s ease-in-out",
              })}
              style={{ width: `${props.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseStudentCard;
