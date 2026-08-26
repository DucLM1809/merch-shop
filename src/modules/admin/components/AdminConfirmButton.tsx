import { useState } from "react";

import { Button, HStack, IconButton, type ButtonProps } from "@chakra-ui/react";
import { Check, X } from "lucide-react";
import type { JSX } from "react";

type AdminConfirmButtonProps = Omit<ButtonProps, "onClick"> & {
  onConfirm: () => void;
  /** Loading state for the mutation this button triggers — shown on the Confirm icon, not the trigger. */
  pending?: boolean;
  /** colorPalette for the armed Confirm icon; falls back to the trigger's own colorPalette. */
  confirmColorPalette?: string;
};

/**
 * Wraps any admin action button — status toggles, bulk operations, retries —
 * so a first click arms an inline Confirm/Cancel pair instead of firing the
 * mutation immediately. Mirrors `AdminRowActions`' delete-confirm shape so
 * every consequential admin action reads the same way.
 */
export function AdminConfirmButton({
  onConfirm,
  pending,
  confirmColorPalette,
  colorPalette,
  size = "xs",
  children,
  ...rest
}: AdminConfirmButtonProps): JSX.Element {
  const [armed, setArmed] = useState(false);

  const handleArm = () => setArmed(true);
  const handleCancel = () => setArmed(false);
  const handleConfirm = () => {
    setArmed(false);
    onConfirm();
  };

  if (armed) {
    return (
      <HStack gap={1}>
        <IconButton
          size={size}
          variant="ghost"
          color="fg.muted"
          title="Cancel"
          aria-label="Cancel"
          onClick={handleCancel}
        >
          <X size={14} />
        </IconButton>
        <IconButton
          size={size}
          colorPalette={confirmColorPalette ?? colorPalette ?? "blue"}
          title="Confirm"
          aria-label="Confirm"
          loading={pending}
          onClick={handleConfirm}
        >
          <Check size={14} />
        </IconButton>
      </HStack>
    );
  }

  return (
    <Button size={size} colorPalette={colorPalette} onClick={handleArm} {...rest}>
      {children}
    </Button>
  );
}
