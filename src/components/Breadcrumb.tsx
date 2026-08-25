import { Breadcrumb as ChakraBreadcrumb } from "@chakra-ui/react";
import { Fragment, type JSX, type ReactNode } from "react";

export type BreadcrumbItem = {
  label: string;
  to?: string;
  params?: Record<string, string>;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  /**
   * Renders the actual navigable link for a non-final item. Kept out of this component
   * so it stays decoupled from the router's route-tree-typed `Link` — the caller, which
   * knows the concrete route, supplies it (same pattern as `PublisherNavView`'s `renderLink`).
   */
  renderLink: (to: string, params: Record<string, string> | undefined, label: string) => ReactNode;
};

export function Breadcrumb({ items, renderLink }: BreadcrumbProps): JSX.Element {
  return (
    <ChakraBreadcrumb.Root>
      <ChakraBreadcrumb.List>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={item.label}>
              <ChakraBreadcrumb.Item>
                {isLast || !item.to ? (
                  // Chakra's CurrentLink defaults to role="link", but the current crumb isn't
                  // clickable. "presentation" strips that role while the ARIA spec's conflict
                  // resolution rule keeps aria-current announced, since a global aria-* attribute
                  // forces a presentational role back to the element's default (non-interactive) one.
                  <ChakraBreadcrumb.CurrentLink role="presentation">
                    {item.label}
                  </ChakraBreadcrumb.CurrentLink>
                ) : (
                  <ChakraBreadcrumb.Link asChild>
                    {renderLink(item.to, item.params, item.label)}
                  </ChakraBreadcrumb.Link>
                )}
              </ChakraBreadcrumb.Item>
              {!isLast && <ChakraBreadcrumb.Separator />}
            </Fragment>
          );
        })}
      </ChakraBreadcrumb.List>
    </ChakraBreadcrumb.Root>
  );
}
