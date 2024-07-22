"use client";

import { getStudentsFromCourse } from "@api/educhain";
import { PublicKey } from "@solana/web3.js";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";
import { hstack, vstack } from "styled-system/patterns";
import Divider from "~/app/components/divider";
import { useProgram } from "~/app/components/solana/solana-provider";
import { useProgramProvider } from "~/app/context/blockchain";
import { Infos, StudentSubscriptionDataAccount } from "~/app/types/educhain";
import * as Table from '~/components/ui/table';

function StudentList({ students }: { students: Infos<StudentSubscriptionDataAccount>[] }) {
  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.Header>Name</Table.Header>
          <Table.Header>Availability</Table.Header>
          <Table.Header>Interests</Table.Header>
          <Table.Header>Skills</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {students.map((student) => (
          <Table.Row key={student.publicKey.toString()}>
            <Table.Cell>{student.account.name}</Table.Cell>
            <Table.Cell>{student.account.availability}</Table.Cell>
            <Table.Cell>{student.account.interests}</Table.Cell>
            <Table.Cell>{student.account.skills.join(", ")}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default function CreateGroups() {

  const { slug } = useParams();

  const [students, setStudents] = useState<Infos<StudentSubscriptionDataAccount>[]>([]);
  const program = useProgram();

  useEffect(() => {
    const getStudents = async () => {
      const students = await getStudentsFromCourse(program, new PublicKey(slug));
      setStudents(students);
    };
    getStudents();
  }, []);


  return (
    <div className={css({ p: 6, bg: "gray.50", minHeight: "100vh" })}>
      <h1
        className={css({
          fontSize: "3xl",
          fontWeight: "bold",
          mb: 6,
          color: "gray.800",
        })}
      >
        Groups Management
      </h1>
      <Divider />
      <StudentList students={students} />
    </div>
  );
}