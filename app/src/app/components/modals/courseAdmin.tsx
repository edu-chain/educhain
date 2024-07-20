import { createSchoolDataAccount, getCourseInfos } from "@api/educhain";
import { css } from "styled-system/css";
import { hstack, vstack } from "styled-system/patterns";
import { useModalsProvider } from "~/app/context/modals"
import { Button } from "~/components/ui/button";
import * as Dialog from "~/components/ui/dialog"
import { Input } from "~/components/ui/input";
import { useProgram } from "../solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Text } from "~/components/ui/text";
import { SingleDatePicker } from "../UI/datePicker";
import { useForm } from "react-hook-form";

type SessionForm = {
  startDate: Date;
  duration: number;
}

function CourseAdminModal() {

  const { CourseAdminModalContext } = useModalsProvider();
  const { open, setOpen, courseAddress } = CourseAdminModalContext;
  const [nextSessionId, setNextSessionId] = useState<number | null>(null);
  
  const {handleSubmit, register, reset} = useForm<SessionForm>(
    {
      defaultValues: {
        startDate: new Date(),
        duration: 2,
      }
    }
  );

  const program = useProgram();
  const wallet = useWallet();




  useEffect(() => {
    if (!courseAddress) return;
    const fetchCourse = async () => {
      const course = await getCourseInfos(
        program,
        new PublicKey(courseAddress)
      );
      if (!course || !course.account.sessionsCounter) return;
      setNextSessionId(course.account.sessionsCounter.toNumber() + 1);
    }
    fetchCourse();
  }, [courseAddress, program]);


  const createSessions = async (name: string) => {
    // await createSchoolDataAccount(program, wallet, name);
    // setOpen(false);
  }

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(false)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          className={css({ maxWidth: "500px", width: "90vw", p: 4 })}
        >
          <form onSubmit={onSubmit}>
            <Dialog.Title>Course Administration</Dialog.Title>
            <Dialog.Description>
              Administer courses
              <p>{courseAddress}</p>
            </Dialog.Description>
            <div className={vstack({ gap: 4, mt: 4 })}>
            </div>
            <Text variant="heading" alignSelf="flex-start">
                Sessions:
              </Text>
              <input
              type="datetime-local"
              {...register("startDate")}
              />
              <input
              type="number"
              {...register("duration")}
              />
            <div
              className={hstack({ gap: 2, justifyContent: "flex-end", pt: 4 })}
            >
              <Dialog.CloseTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </Dialog.CloseTrigger>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

export default CourseAdminModal;