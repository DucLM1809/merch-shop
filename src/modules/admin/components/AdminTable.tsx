import { Box, chakra, HStack, IconButton, type BoxProps } from "@chakra-ui/react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import type { JSX, ReactNode } from "react";

import { Card } from "@/components/Card";

// `Box`'s type is fixed to div attributes regardless of `as`, so `colSpan` needs the
// `chakra("td")` factory (same escape hatch `FormField` already uses for `<label>`) to
// type-check on the one cell that spans the detail row.
const Td = chakra("td");

export type AdminColumn = {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "right";
};

type AdminTableProps = {
  columns: AdminColumn[];
  /** Reserves a trailing, unlabeled header cell for a row's Edit/Delete actions. */
  hasActionsColumn?: boolean;
  children: ReactNode;
};

/**
 * The shared real-<table> shell every Admin CRUD view renders onto: one Card,
 * a header derived from a column list, and a caller-supplied <tbody>. Ticket
 * 0lf.8 rolls this out to the remaining Admin views without re-deriving it.
 */
export function AdminTable({ columns, hasActionsColumn, children }: AdminTableProps): JSX.Element {
  return (
    <Card p={0} clipCorner={false}>
      <Box overflowX="auto">
        <Box as="table" w="full" borderCollapse="collapse">
          <Box as="thead" bg="bg.muted">
            <Box as="tr">
              {columns.map((col) => (
                <Box
                  as="th"
                  key={col.key}
                  textAlign={col.align ?? "left"}
                  w={col.width}
                  px={4}
                  py={3}
                  fontSize="xs"
                  fontWeight="700"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  {col.label}
                </Box>
              ))}
              {hasActionsColumn && <Box as="th" w="160px" />}
            </Box>
          </Box>
          <Box as="tbody">{children}</Box>
        </Box>
      </Box>
    </Card>
  );
}

type AdminTableRowProps = BoxProps & {
  /** Gives the row a pointer cursor and a hover fill — for a row that toggles its own detail row. */
  clickable?: boolean;
  /** Persistent highlight, independent of hover — for a row whose detail row is currently open. */
  active?: boolean;
};

export function AdminTableRow({ clickable, active, ...rest }: AdminTableRowProps): JSX.Element {
  return (
    <Box
      as="tr"
      borderBottom="1px solid"
      borderColor="border.default"
      bg={active ? "bg.muted" : undefined}
      cursor={clickable ? "pointer" : undefined}
      _hover={clickable ? { bg: "bg.muted" } : undefined}
      _last={{ borderBottomWidth: 0 }}
      transition="background 0.1s"
      {...rest}
    />
  );
}

type AdminTableCellProps = BoxProps & {
  align?: "left" | "right";
  colSpan?: number;
};

export function AdminTableCell({ align, colSpan, ...rest }: AdminTableCellProps): JSX.Element {
  return (
    <Td
      colSpan={colSpan}
      px={4}
      py={3.5}
      textAlign={align ?? "left"}
      verticalAlign="middle"
      {...rest}
    />
  );
}

type AdminRowActionsProps = {
  /** Omit for rows with no edit affordance (e.g. SKUs, which only toggle availability or delete). */
  onEdit?: () => void;
  onDeleteStart: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  /** True while this row's delete is asking "are you sure" — swaps Edit/Delete for Cancel/Confirm. */
  confirming: boolean;
  deleting?: boolean;
};

/**
 * Every Admin CRUD view ended each row with the same "Edit" / "Delete" text
 * buttons (plus a "Confirm" / "✕" pair once delete was armed) — repeating two
 * or three words on every single row is most of what made the tables read as
 * a wall of prose. Icon-only actions carry the same meaning at a glance
 * without the repetition; `title` keeps them discoverable on hover and
 * `aria-label` keeps them named for tests and screen readers.
 */
export function AdminRowActions({
  onEdit,
  onDeleteStart,
  onDeleteCancel,
  onDeleteConfirm,
  confirming,
  deleting,
}: AdminRowActionsProps): JSX.Element {
  if (confirming) {
    return (
      <HStack justify="flex-end" gap={1}>
        <IconButton
          size="xs"
          variant="ghost"
          color="fg.muted"
          title="Cancel"
          aria-label="Cancel"
          onClick={onDeleteCancel}
        >
          <X size={14} />
        </IconButton>
        <IconButton
          size="xs"
          colorPalette="danger"
          title="Confirm"
          aria-label="Confirm"
          loading={deleting}
          onClick={onDeleteConfirm}
        >
          <Check size={14} />
        </IconButton>
      </HStack>
    );
  }

  return (
    <HStack justify="flex-end" gap={0.5}>
      {onEdit && (
        <IconButton
          size="xs"
          variant="ghost"
          color="fg.muted"
          title="Edit"
          aria-label="Edit"
          onClick={onEdit}
        >
          <Pencil size={14} />
        </IconButton>
      )}
      <IconButton
        size="xs"
        variant="ghost"
        colorPalette="danger"
        title="Delete"
        aria-label="Delete"
        onClick={onDeleteStart}
      >
        <Trash2 size={14} />
      </IconButton>
    </HStack>
  );
}
