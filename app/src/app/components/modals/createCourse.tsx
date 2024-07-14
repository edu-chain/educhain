import React, { useState } from 'react'
import { css } from 'styled-system/css'
import { vstack, hstack } from 'styled-system/patterns'
import * as Dialog from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useForm, Controller } from "react-hook-form";
import { useModalsProvider } from '~/app/context/modals'
import { SingleDatePicker } from '~/app/components/UI/datePicker'
import { useProgram } from '../solana/solana-provider'
import { useWallet } from '@solana/wallet-adapter-react'
import { createCourseAccount } from '@api/educhain'
import { PublicKey } from '@solana/web3.js'

type Session = {
  date: Date | null
  duration: number
}

function CreateCourseModal() {
  const { CreateCourseModalContext } = useModalsProvider()
  const { open, setOpen } = CreateCourseModalContext

  const [courseName, setCourseName] = useState<string>()
  const [maxStudents, setMaxStudents] = useState<number>()
  const [groupSize, setGroupSize] = useState<number>()
  const [sessions, setSessions] = useState<Session[]>([])

  const program = useProgram()
  const wallet = useWallet()

  const { control, handleSubmit } = useForm<{
    sessions: Session[]
  }>();

  const onSubmit = (data: { sessions: Session[] }) => {
    console.log(data);
    createCourseAccount(program, wallet, {
      name: courseName || "",
      admins: [wallet.publicKey as PublicKey],
    });
  };

  const handleAddSession = () => {
    setSessions([...sessions, { date: null, duration: 60 }])
  }

  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(false)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          className={css({ maxWidth: "500px", width: "90vw", p: 4 })}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Dialog.Title>Create New Course</Dialog.Title>
            <Dialog.Description>
              Fill in the details to create a new course.
            </Dialog.Description>
            <div className={vstack({ gap: 4, mt: 4 })}>
              <Input
                type="text"
                placeholder="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max Students"
                value={maxStudents}
                onChange={(e) => setMaxStudents(parseInt(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Group Size"
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value))}
              />

              <Text variant="heading" alignSelf="flex-start">
                Sessions:
              </Text>
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className={hstack({
                    gap: 2,
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  })}
                >
                  <Controller
                    name={`sessions.${index}.date`}
                    control={control}
                    render={({ field }) => (
                      <SingleDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select date"
                      />
                    )}
                  />
                  <Input
                    placeholder="Duration (minutes)"
                    value={session.duration}
                    onChange={(e) => {
                      const updatedSessions = [...sessions];
                      updatedSessions[index].duration =
                        parseInt(e.target.value) || 0;
                      setSessions(updatedSessions);
                    }}
                    type="number"
                  />
                </div>
              ))}
              <Button
                variant="subtle"
                alignSelf="flex-start"
                onClick={handleAddSession}
              >
                Add Session
              </Button>
            </div>
            <div
              className={hstack({ gap: 2, justifyContent: "flex-end", pt: 4 })}
            >
              <Dialog.CloseTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </Dialog.CloseTrigger>
              <Button type="submit">Create Course</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export default CreateCourseModal