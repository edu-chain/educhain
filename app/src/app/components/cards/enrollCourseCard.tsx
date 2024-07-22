"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { hstack, grid } from "styled-system/patterns";
import { useProgramProvider } from "~/app/context/blockchain";
import Loading from "~/app/components/loading";
import { css } from "styled-system/css";
import * as Card from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Book } from "lucide-react";
import EnrollCourseModal from "~/app/components/modals/enrollCourse";
import { useModalsProvider } from "~/app/context/modals";
import { PublicKey } from "@solana/web3.js";
import { CourseData } from "~/app/types/educhain";
import { Infos } from "~/app/types/educhain";


type Props = {
  course: Infos<CourseData>;
};

function EnrollCourseCard({ course }: Props) {
    const { EnrollCourseModalContext } = useModalsProvider();
    const {setOpen} = EnrollCourseModalContext;
    const { CourseContext } = useProgramProvider();

    console.log(course);

    const handleClick = (course: PublicKey) => {
      console.log(course)
      CourseContext.selectCourse(course);
      setOpen(true);
    };

  return (
    <Card.Root key={course.publicKey.toString()}>
      <Card.Header>
        <Card.Title className={hstack({ gap: 2, alignItems: "center" })}>
          <Book className={css({ color: "blue.500", width: 6, height: 6 })} />
          {course.account.name}
          <div className={css({ marginLeft: "auto" })}>
            <Badge
              variant="outline"
              size="lg"
              onClick={() => handleClick(course.publicKey)}
              className={css({
                cursor: "pointer",
                "&:hover": {
                  bg: "lightyellow",
                },
              })}
            >
              Enroll
            </Badge>
          </div>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Badge variant="outline" className={css({ alignSelf: "flex-start" })}>
          {course.account.sessionsCounter?.toString() || "0"} sessions
        </Badge>
        <div
          className={css({
            fontSize: "sm",
            color: "gray.600",
            wordBreak: "break-all",
            mt: 2,
          })}
        >
          School: {course.account.school?.toString() || "Unknown"}
        </div>
      </Card.Body>
    </Card.Root>
  );
}

export default EnrollCourseCard;
