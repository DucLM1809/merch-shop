import type { JSX } from "react";

import { Box, Flex } from "@chakra-ui/react";

import { PublisherPageView } from "./PublisherPageView";

import { ProductCatalog } from "./ProductCatalog";
import { PublisherNav } from "./PublisherNav";
import { usePublisher } from "../hooks";

type Props = {
  publisherSlug: string;
};

export function PublisherPage({ publisherSlug }: Props): JSX.Element {
  const { data: publisher, isLoading, isError, refetch } = usePublisher(publisherSlug);

  return (
    <Flex>
      <PublisherNav activePublisherSlug={publisherSlug} />
      <Box flex={1} style={{ "--accent": publisher?.accentColor } as React.CSSProperties}>
        <PublisherPageView
          publisher={publisher}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <ProductCatalog filters={{ publisher: publisherSlug }} />
      </Box>
    </Flex>
  );
}
