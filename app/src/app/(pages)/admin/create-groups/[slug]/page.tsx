"use client";

import { getStudentsFromCourse } from "@api/educhain";
import { PublicKey } from "@solana/web3.js";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { css } from "styled-system/css";
import Divider from "~/app/components/divider";
import { useProgram } from "~/app/components/solana/solana-provider";
import { Infos, StudentSubscriptionDataAccount } from "~/app/types/educhain";
import { Button } from "~/components/ui/button";
import * as Table from '~/components/ui/table';
import * as Card from '~/components/ui/card';

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

type GroupMember = {
  id: string;
  skills: string;
  commitment: number;
  interest: string;
};

type Group = {
  members: GroupMember[];
  average_commitment: number;
  common_interest: string;
};

type Output = {
  groups: Group[];
};

export default function CreateGroups() {

  const { slug } = useParams();

  const [students, setStudents] = useState<Infos<StudentSubscriptionDataAccount>[]>([]);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const program = useProgram();

  useEffect(() => {
    const getStudents = async () => {
      const students = await getStudentsFromCourse(program, new PublicKey(slug));
      setStudents(students);
    };
    getStudents();
  }, []);

  const handleCreateGroup = async () => {
    const studentsPrompt = students.map((student) => {
      return `{"id": "${student.publicKey.toString()}", "availability": "${student.account.availability}", "interests": "${student.account.interests}", "skills": "${student.account.skills.join(", ")}"}`;
    });
    const response = await fetch(
      "/api/generate-group",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "prompt": JSON.stringify(studentsPrompt),
        })
      }
    );
    const data = await response.json();
    const completion = JSON.parse(data.message) as Output;
    setGroups(completion.groups);
  }

  const findNameStudent = (id: string) => {
    return students.find((student) => student.publicKey.toString() === id)?.account.name;
  }


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
      <Divider />
{groups ? (
        <div className={css({ mt: 6, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 4 })}>
          {groups.map((group, index) => (
            <Card.Root key={index}>
              <Card.Header>
                <Card.Title>Group {index + 1}</Card.Title>
              </Card.Header>
              <Card.Body>
                <p className={css({ fontWeight: "bold", mb: 2 })}>Common interest: {group.common_interest}</p>
                <p className={css({ mb: 4 })}>Average commitment: {group.average_commitment}</p>
                <h3 className={css({ fontWeight: "bold", mb: 2 })}>Members:</h3>
                {group.members.map((member) => (
                  <div key={member.id} className={css({ mb: 2 })}>
                    <p className={css({ fontWeight: "semibold" })}>{findNameStudent(member.id)}</p>
                    <p>Skills: {member.skills}</p>
                    <p>Commitment: {member.commitment}</p>
                    <p>Interest: {member.interest}</p>
                  </div>
                ))}
              </Card.Body>
            </Card.Root>
          ))}
        </div>
      )
      :
        <Button
          className={css({ mt: 6 })}
          onClick={handleCreateGroup}
        >Create Group by AI</Button>
      }
    </div>
  );
}