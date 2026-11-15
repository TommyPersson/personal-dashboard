import { DeleteOutlined, PlayArrowOutlined } from "@mui/icons-material"
import { Stack } from "@mui/material"
import { CommandButton, CommandButtonProps } from "@src/common/components/CommandButton/CommandButton.tsx"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"
import { OperationError } from "@src/infrastructure/framework/errors"
import type { Meta, StoryObj } from "@storybook/react-vite"

// The commands run locally instead of calling the backend, so the stories also work in tests

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const runCommand = defineCommand({
  mutationOptions: {
    mutationFn: async () => {
      await delay(1_000)
    },
  },
  label: "Run",
  icon: PlayArrowOutlined,
})

const neverEndingCommand = defineCommand({
  mutationOptions: {
    mutationFn: () => new Promise<void>(() => {}),
  },
  label: "Run forever",
  icon: PlayArrowOutlined,
})

const failingCommand = defineCommand({
  mutationOptions: {
    mutationFn: async (): Promise<void> => {
      throw new OperationError({ requestId: "storybook", errorCode: "UNAVAILABLE", errorMessage: "WinCtrl is down" })
    },
  },
  label: "Fail",
  icon: PlayArrowOutlined,
  errorTitle: "Unable to run",
})

const deleteItemCommand = defineCommand({
  mutationOptions: {
    mutationFn: async (_args: { itemId: string }) => {
      await delay(1_000)
    },
  },
  label: "Delete item",
  icon: DeleteOutlined,
  color: "error",
  canExecute: (args) => args.itemId !== "locked",
})

// The component is generic, so the stories use its props with the command types left open
type AnyCommandButtonProps = CommandButtonProps<any, any>

const meta = {
  title: "Common/CommandButton",
  render: (args) => (
    <Stack direction={"row"} spacing={2} sx={{ p: 2, alignItems: "center" }}>
      <CommandButton {...args} />
      <CommandButton {...args} iconOnly />
    </Stack>
  ),
} satisfies Meta<AnyCommandButtonProps>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { command: runCommand },
}

export const Pending: Story = {
  args: { command: neverEndingCommand },
}

/** The error is shown in a popover below the button until dismissed. */
export const Failing: Story = {
  args: { command: failingCommand },
}

export const WithArgs: Story = {
  args: { command: deleteItemCommand, args: { itemId: "item-1" } },
}

/** Disabled by the command's `canExecute`. */
export const CannotExecute: Story = {
  args: { command: deleteItemCommand, args: { itemId: "locked" } },
}

/** Disabled while the arguments aren't available. */
export const ArgsNotAvailable: Story = {
  args: { command: deleteItemCommand, args: null },
}

export const Disabled: Story = {
  args: { command: runCommand, disabled: true },
}
