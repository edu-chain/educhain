import { useForm } from "react-hook-form";
import { StudentSubscriptionDataAccount } from '~/app/types/educhain'

import { css } from 'styled-system/css'
import { vstack, hstack } from 'styled-system/patterns'

import * as Dialog from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { useModalsProvider } from '~/app/context/modals'
import { useProgramProvider } from "~/app/context/blockchain";


type StudentSubscriptionDataForm = {
  name: "",
  availability: 0,
  interests: "",
  skill1: "",
  skill2: "",
  skill3: "",
}

function EnrollCourseModal() {
  const { EnrollCourseModalContext } = useModalsProvider();
  const { open, setOpen } = EnrollCourseModalContext;

  const { CourseContext, GeneralContext } = useProgramProvider();

  const { handleSubmit, register, reset } = useForm<StudentSubscriptionDataForm>({
    defaultValues: {
      name: "",
      availability: 0,
      interests: "",
      skill1: "",
      skill2: "",
      skill3: "",
    },
  });

  const onSubmit = async (data: StudentSubscriptionDataForm) => {

    const studentSubscriptionData: StudentSubscriptionDataAccount = {
      course: GeneralContext.selectedItems.course!,
      name: data.name,
      availability: data.availability,
      skills: [data.skill1, data.skill2, data.skill3],
      interests: data.interests,
    };

    console.log(studentSubscriptionData);

    CourseContext.enrollCourse(studentSubscriptionData);
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
            <Dialog.Title>Enroll in Course</Dialog.Title>
            <Dialog.Description>
              Fill in the details to enroll in a course.
            </Dialog.Description>
            <div className={vstack({ gap: 4, mt: 4 })}>
              <Input
                type="text"
                placeholder="Your Name"
                {...register('name', {
                  required: true,
                  minLength: 3,
                  maxLength: 20,
                })}
              />
              <Text variant="heading" alignSelf="flex-start">
                Availability for project:
              </Text>
              <Text size="sm" alignSelf="flex-start">
                1 is very low, 5 is very high
              </Text>
              <Input
                type="number"
                placeholder="Availability"
                {...register('availability', {
                  required: true,
                  min: 1,
                  max: 5,
                })}
              />

              <Text variant="heading" alignSelf="flex-start">
                Skills:
              </Text>
              <Input
                type="text"
                placeholder="Skill"
                {...register('skill1', {
                  required: true,
                  minLength: 3,
                  maxLength: 32,
                })}
              />
              <Input
                type="text"
                placeholder="Skill"
                {...register('skill2', {
                  max: 32,
                })}
              />
              <Input
                type="text"
                placeholder="Skill"
                {...register('skill3', {
                  max: 32,
                })}
              />
              <Text variant="heading" alignSelf="flex-start">
                Interests:
              </Text>
              <Text size="sm" alignSelf="flex-start">
                Describe your interests
              </Text>
              <Input
                type="text"
                placeholder="Interests"
                {...register('interests', {
                  required: true,
                  minLength: 3,
                  maxLength: 100,
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
              <Button type="submit">Enroll in Course</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export default EnrollCourseModal