import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Heading } from "~/components/ui/heading";
import { Stack, HStack } from "styled-system/jsx";
import * as Select from "~/components/ui/select";

type SelectItem = {
  label: string;
  value: string;
};

type SelectProps = {
  className?: string;
  label: string;
  value?: string;
  items: SelectItem[];
  onSelect: (item: string) => void;
};


export function SelectComp({ label, items, onSelect, value, className }: SelectProps) {
  console.log(label, value)
  return (
    <Select.Root
      positioning={{ sameWidth: true }}
      width="2xs"
      items={items}
      className={className}
    >
      <Select.Label>{label}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select" />
          <ChevronsUpDownIcon />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.ItemGroup defaultValue={value}>
            <Select.ItemGroupLabel>{label}</Select.ItemGroupLabel>
            {items.map((item: SelectItem) => (
              <Select.Item
                key={item.value}
                item={item}
                onClick={() => onSelect(item.label)}
              >
                <Select.ItemText defaultValue={value}>
                  {item.label}
                </Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
