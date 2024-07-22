import { createSchoolDataAccount } from "@api/educhain";
import { css } from "styled-system/css";
import { hstack, vstack } from "styled-system/patterns";
import { useModalsProvider } from "~/app/context/modals"
import { Button } from "~/components/ui/button";
import * as Dialog from "~/components/ui/dialog"
import { Input } from "~/components/ui/input";
import { useProgram } from "../solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgramProvider } from "~/app/context/blockchain";

function CreateSchoolModal() {
  const { CreateSchoolModalContext } = useModalsProvider();
  const { open, setOpen } = CreateSchoolModalContext;

  const { SchoolContext } = useProgramProvider();

  const createSchool = async (name: string) => {
    await SchoolContext.createSchool(name);
    setOpen(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const name = data.get("name") as string;
    createSchool(name);
  };

  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen(false)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          className={css({ maxWidth: "500px", width: "90vw", p: 4 })}
        >
          <form onSubmit={onSubmit}>
            <Dialog.Title>Create New Course</Dialog.Title>
            <Dialog.Description>
              Fill in the details to create a new course.
            </Dialog.Description>
            <div className={vstack({ gap: 4, mt: 4 })}>
              <Input
                type="text"
                placeholder="School Name"
                name="name"
                required
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
  )
}

export default CreateSchoolModal;