"use client"
import {
  ChevronRightIcon,
  CreditCardIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import { HStack } from "styled-system/jsx";
import { Button } from "~/components/ui/button";
import * as Menu from "~/components/ui/menu";
import { Text } from "~/components/ui/text";
import { css } from "styled-system/css";
import { useRouter } from "next/navigation";

const UserMenu = (props: Menu.RootProps) => {
    const router = useRouter();
  return (
    <Menu.Root {...props}>
      <Menu.Trigger asChild>
        <button
          className={css({
            rounded: "full",
            bg: "gray.100",
            _hover: { bg: "gray.200" },
            _dark: { bg: "gray.700", _hover: { bg: "gray.600" } },
          })}
          aria-label="User menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={css({ w: 6, h: 6 })}
          >
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>My Account</Menu.ItemGroupLabel>
            <Menu.Separator />
            <Menu.Item value="profile" onClick={() => router.push("/profile")}>
              <HStack gap="6" justify="space-between" flex="1">
                <HStack gap="2">
                  <UserIcon />
                  Profile
                </HStack>
                <Text as="span" color="fg.subtle" size="sm">
                  ⇧⌘P
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Item value="billing">
              <HStack gap="2">
                <CreditCardIcon /> Billing
              </HStack>
            </Menu.Item>
            <Menu.Item value="settings">
              <HStack gap="6" justify="space-between" flex="1">
                <HStack gap="2">
                  <SettingsIcon /> Settings
                </HStack>
                <Text as="span" color="fg.subtle" size="sm">
                  ⌘,
                </Text>
              </HStack>
            </Menu.Item>
            <Menu.Root
              positioning={{ placement: "right-start", gutter: -2 }}
              {...props}
            >
              <Menu.TriggerItem justifyContent="space-between">
                <HStack gap="2">
                  <UserPlusIcon />
                  Invite member
                </HStack>
                <ChevronRightIcon />
              </Menu.TriggerItem>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="email">
                    <HStack gap="2">
                      <MailIcon /> Email
                    </HStack>
                  </Menu.Item>
                  <Menu.Item value="message">
                    <HStack gap="2">
                      <MessageSquareIcon /> Message
                    </HStack>
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item value="other">
                    <HStack gap="2">
                      <PlusCircleIcon />
                      More Options...
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            <Menu.Separator />
            <Menu.Item value="logout">
              <HStack gap="2">
                <LogOutIcon />
                Logout
              </HStack>
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};

export default UserMenu;