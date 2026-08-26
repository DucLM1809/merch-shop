import { Box, Drawer, HStack, IconButton } from "@chakra-ui/react";
import { X } from "lucide-react";

import type { JSX, ReactNode } from "react";

type AdminFormSheetProps = {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  /** The form body + footer — fields and Cancel/Save actions differ per view. */
  children: ReactNode;
};

/**
 * The shared full-width bottom-sheet chrome (Drawer, placement=bottom) every
 * Admin CRUD view's create/edit form renders onto: sizing (h=80vh, rounded
 * top, no bottom border), the drag-handle affordance, and a title + close
 * header. Established for AdminProductsView in 0lf.9; ticket 0lf.10 extracts
 * it before 0lf.11-0lf.15 roll it out to the remaining views.
 */
export function AdminFormSheet({
  open,
  onOpenChange,
  title,
  children,
}: AdminFormSheetProps): JSX.Element {
  return (
    <Drawer.Root open={open} placement="bottom" onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content
          bg="bg.panel"
          borderWidth="1px"
          borderColor="border.muted"
          borderBottomWidth={0}
          borderTopRadius="xl"
          w="full"
          h="80vh"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          <Box w="10" h="1" bg="border.emphasized" borderRadius="full" mx="auto" mt={3} mb={1} />

          <HStack
            justify="space-between"
            px={6}
            pt={2}
            pb={4}
            borderBottomWidth="1px"
            borderColor="border.muted"
          >
            <Drawer.Title textStyle="h3" color="fg">
              {title}
            </Drawer.Title>
            <Drawer.CloseTrigger asChild>
              <IconButton aria-label="Close" size="xs" variant="ghost" color="fg.muted">
                <X size={14} />
              </IconButton>
            </Drawer.CloseTrigger>
          </HStack>

          {children}
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
