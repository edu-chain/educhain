import { css } from "styled-system/css";
import { hstack, vstack } from "styled-system/patterns";
import { useModalsProvider } from "~/app/context/modals"
import { Button } from "~/components/ui/button";
import * as Dialog from "~/components/ui/dialog"
import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Text } from "~/components/ui/text";
import { useForm } from "react-hook-form";
import { useProgramProvider } from "~/app/context/blockchain";
import { BN } from "@coral-xyz/anchor";
import { SessionData } from "~/app/types/educhain";

type SessionForm = {
  startDate: Date;
  duration: number;
}

function CourseAdminModal() {
  const { CourseAdminModalContext } = useModalsProvider();
  const { open, setOpen, courseAddress } = CourseAdminModalContext;
  const [nextSessionId, setNextSessionId] = useState<number | null>(null);
  
  const { handleSubmit, register, reset } = useForm<SessionForm>({
    defaultValues: {
      startDate: new Date(),
      duration: 2,
    }
  });

  const { CourseContext, SessionContext, GeneralContext } = useProgramProvider();

  useEffect(() => {
    if (!courseAddress) return;
    const fetchCourse = async () => {
      const course = CourseContext.courses?.find(c => c.publicKey.toString() === courseAddress);
      if (!course || !course.account.sessionsCounter) return;
      setNextSessionId(course.account.sessionsCounter.toNumber() + 1);
    }
    fetchCourse();
  }, [courseAddress, CourseContext.courses]);

  const onSubmit = async (data: SessionForm) => {
    if (!courseAddress || !GeneralContext.selectedItems.school) return;

    const endDate = new Date(data.startDate);
    endDate.setHours(endDate.getHours() + data.duration);

    const sessionData: SessionData = {
      course: new PublicKey(courseAddress),
      start: new BN(Math.floor(data.startDate.getTime() / 1000)),
      end: new BN(Math.floor(endDate.getTime() / 1000)),
      id: new BN(nextSessionId || 0), // Assuming nextSessionId is available
      // attendancesCounter: new BN(0),
    };

    try {
      SessionContext.createSession({
        sessionData,
        courseAddress: new PublicKey(courseAddress),
        schoolAddress: GeneralContext.selectedItems.school,
      });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to create session:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(false)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          className={css({ maxWidth: "500px", width: "90vw", p: 4 })}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Dialog.Title>Course Administration</Dialog.Title>
            <Dialog.Description>
              Administer courses
              <p>{courseAddress}</p>
            </Dialog.Description>
            <div className={vstack({ gap: 4, mt: 4 })}>
              <Text variant="heading" alignSelf="flex-start">
                Sessions:
              </Text>
              <Input
                type="datetime-local"
                {...register("startDate", { 
                  valueAsDate: true,
                  required: true 
                })}
              />
              <Input
                type="number"
                {...register("duration", { 
                  required: true,
                  min: 1
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
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

export default CourseAdminModal;