import { CalendarIcon } from "lucide-react";
import * as DatePicker from "~/components/ui/date-picker";
import { IconButton } from "~/components/ui/icon-button";
import { Input } from "~/components/ui/input";
import { useController, Control } from "react-hook-form";

interface CustomDatePickerProps extends Omit<DatePicker.RootProps, 'value' | 'onValueChange'> {
  name: string;
  control: Control<any>;
  label?: string;
}

export const CustomDatePicker = ({ name, control, label, ...props }: CustomDatePickerProps) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <DatePicker.Root
      positioning={{ sameWidth: true }}
      startOfWeek={1}
      selectionMode="single"
      value={value}
      onValueChange={onChange}
      {...props}
    >
      <DatePicker.Control>
        <DatePicker.Input asChild>
          <Input placeholder={label} />
        </DatePicker.Input>
        <DatePicker.Trigger asChild>
          <IconButton variant="outline" aria-label="Open date picker">
            <CalendarIcon />
          </IconButton>
        </DatePicker.Trigger>
      </DatePicker.Control>
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
      <DatePicker.Positioner>
        <DatePicker.Content>
          <DatePicker.View view="day" />
        </DatePicker.Content>
      </DatePicker.Positioner>
    </DatePicker.Root>
  );
};
