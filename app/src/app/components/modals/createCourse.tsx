import React, { useState } from 'react'
import { css } from 'styled-system/css'
import { vstack, hstack } from 'styled-system/patterns'
import * as Dialog from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { SelectComp } from '../UI/select'
import { CalendarDate } from '@internationalized/date'
import { CustomDatePicker } from "../UI/datePicker";
import { useForm } from "react-hook-form";


type Session = {
  date: CalendarDate | null
  duration: number
}

type Props = {
  open: boolean
  onClose: () => void
}

function CreateCourseModal({open, onClose}: Props) {
  const [maxStudents, setMaxStudents] = useState<number>()
  const [groupSize, setGroupSize] = useState<number>()
  const [selectedTag, setSelectedTag] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])

  const { control, handleSubmit } = useForm();

  const tagOptions = [
    { label: 'Dev', value: 'dev' },
    { label: 'Design', value: 'design' },
    { label: 'Marketing', value: 'marketing' },
  ]

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleAddSession = () => {
    setSessions([...sessions, { date: null, duration: 60 }])
  }

  const handleSessionChange = (index: number, field: keyof Session, value: any) => {
    const updatedSessions = [...sessions]
    updatedSessions[index] = { ...updatedSessions[index], [field]: value }
    setSessions(updatedSessions)
  }

  console.log(sessions)

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
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
            <SelectComp
              className={css({ width: "100%" })}
              label="Course Type"
              items={tagOptions}
              value={selectedTag}
              onSelect={(value) => setSelectedTag(value)}
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
                <CustomDatePicker name={`session.date`} control={control} />
                {/* <Input
                placeholder="Duration (minutes)"
                value={session.duration}
                onChange={(e) =>
                  handleSessionChange(
                    index,
                    "duration",
                    parseInt(e.target.value) || 0
                  )
                }
                type="number"
              /> */}
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
              <Button variant="outline">Cancel</Button>
            </Dialog.CloseTrigger>
            <Button type="submit">Create Course</Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default CreateCourseModal