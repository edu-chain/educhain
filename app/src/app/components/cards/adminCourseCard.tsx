import React from "react";
import { css } from "styled-system/css";
import { gridItem, hstack } from "styled-system/patterns";
import { Progress } from "~/components/ui/progress";
import { CourseData, Infos } from "~/app/types/educhain";
import Link from "next/link";



function AdminCourseCard(props: Infos<CourseData>) {

  return (
    <Link href={`/course/${props.publicKey.toBase58()}`}>
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
              {props.account.name} [{props.account.id?.toNumber()}]
            </h3>
          </div>
            <p>{props.publicKey.toBase58()}</p>

          <div className={css({ mb: 4, mt: 4 })}>
            <h4
              className={css({
                fontSize: "md",
                fontWeight: "semibold",
                mb: 2,
                color: "gray.700",
                _dark: { color: "gray.300" },
              })}
            >
              Course Details:
            </h4>
            <ul className={css({ listStyleType: "none", pl: 0 })}>
              <li
                className={css({
                  mb: 1,
                  color: "gray.600",
                  _dark: { color: "gray.400" },
                })}
              >
                Students: <strong>TODO</strong>
              </li>
              <li
                className={css({
                  mb: 1,
                  color: "gray.600",
                  _dark: { color: "gray.400" },
                })}
              >
                Max Group Size: <strong>TODO</strong>
              </li>
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
              Overall Progress
            </span>
            <Progress value={0} min={0} max={100} />
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
                style={{ width: `${0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default AdminCourseCard;
