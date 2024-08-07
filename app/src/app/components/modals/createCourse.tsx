import { useForm } from "react-hook-form";
import { PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { BN } from '@coral-xyz/anchor'
import { createCourseDataAccount } from '@api/educhain'
import { CourseData } from '~/app/types/educhain'

import { css } from 'styled-system/css'
import { vstack, hstack } from 'styled-system/patterns'

import { useProgram } from "~/app/components/solana/solana-provider";
import * as Dialog from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useModalsProvider } from '~/app/context/modals'
import { useProgramProvider } from "~/app/context/blockchain";

type CourseDataForm = {
  name: string,
  maxStudents: number,
  groupSize: number,
  admin1: string,
  admin2: string,
}

function CreateCourseModal() {
  const { CreateCourseModalContext } = useModalsProvider();
  const { open, setOpen } = CreateCourseModalContext;

  const { CourseContext, GeneralContext } = useProgramProvider();
  const wallet = useWallet();

  const { handleSubmit, register, reset } = useForm<CourseDataForm>({
    defaultValues: {
      name: "",
      maxStudents: 60,
      groupSize: 3,
      admin1: wallet.publicKey?.toBase58() || "",
      admin2: "",
    },
  });

  const onSubmit = async (data: CourseDataForm) => {
    const admins = [new PublicKey(data.admin1)];
    if (data.admin2 !== "") {
      admins.push(new PublicKey(data.admin2));
    }

    const courseData: CourseData = {
      name: data.name,
      maxStudents: new BN(data.maxStudents),
      groupSize: new BN(data.groupSize),
      admins: admins,
      school: GeneralContext.selectedItems.school!, // Assuming a school is selected
      schoolOwner: wallet.publicKey!, // Assuming the wallet owner is the school owner
      id: new BN(0), // This will be set by the program
      sessionsCounter: new BN(0),
      groupsCounter: new BN(0),
    };

    CourseContext.createCourse(courseData);
    reset();
    setOpen(false);
  };

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
                {...register('name', {
                  required: true,
                  minLength: 3,
                  maxLength: 20,
                })}
              />
              <Input
                type="number"
                placeholder="Max Students"
                {...register('maxStudents', {
                  required: true,
                  min: 1,
                  max: 100,
                })}
              />
              <Input
                type="number"
                placeholder="Group Size"
                {...register('groupSize', {
                  required: true,
                  min: 1,
                  max: 100,
                })}
              />

              <Text variant="heading" alignSelf="flex-start">
                Course Admins:
              </Text>
              <Input
                type="text"
                placeholder="Course Admin"
                {...register('admin1', {
                  required: true,
                  validate: (value) => {
                    return value === wallet.publicKey?.toBase58()
                  }
                })}
              />
              <Input
                type="text"
                placeholder="Course Admin"
                {...register('admin2', {
                  required: false,
                  validate: (value) => {
                    if (value === "") {
                      return true
                    }
                    return value === wallet.publicKey?.toBase58()
                  }
                })}
              />

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