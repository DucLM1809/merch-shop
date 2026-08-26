import { Box, chakra, type BoxProps } from "@chakra-ui/react";
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
    <Card p={0}>
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
