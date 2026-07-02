# Graph Report - merch-shop (2026-07-02)

## Corpus Check

- 146 files · ~30,267 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 557 nodes · 1214 edges · 38 communities (24 shown, 14 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness

- Built from commit: `f927e150`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)

- [[_COMMUNITY_Routes & Page Containers|Routes & Page Containers]]
- [[_COMMUNITY_HTTP Client & API Types|HTTP Client & API Types]]
- [[_COMMUNITY_Catalog Browse Components|Catalog Browse Components]]
- [[_COMMUNITY_Cart View & Stories|Cart View & Stories]]
- [[_COMMUNITY_Publisher Nav UI|Publisher Nav UI]]
- [[_COMMUNITY_Catalog View Tests|Catalog View Tests]]
- [[_COMMUNITY_Product Detail View|Product Detail View]]
- [[_COMMUNITY_Account & Auth UI|Account & Auth UI]]
- [[_COMMUNITY_Product Catalog View|Product Catalog View]]
- [[_COMMUNITY_Orders Module|Orders Module]]
- [[_COMMUNITY_Facet Filter Stories|Facet Filter Stories]]
- [[_COMMUNITY_App Shell & Theme|App Shell & Theme]]
- [[_COMMUNITY_Checkout Form Stories|Checkout Form Stories]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]

## God Nodes (most connected - your core abstractions)

1. `FileRoutesByPath` - 22 edges
2. `renderRoute()` - 16 edges
3. `renderWithProviders()` - 15 edges
4. `Product` - 13 edges
5. `server` - 13 edges
6. `usePublishers()` - 12 edges
7. `Publisher` - 11 edges
8. `AdminProductsView()` - 11 edges
9. `Game` - 10 edges
10. `FormField()` - 10 edges

## Surprising Connections (you probably didn't know these)

- `renderFilter()` --calls--> `renderWithProviders()` [EXTRACTED]
  src/modules/catalog/components/FacetFilterView.test.tsx → src/test-utils.tsx
- `ProductCatalogViewProps` --references--> `Product` [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `Product` [EXTRACTED]
  src/modules/catalog/components/ProductDetailView.tsx → src/api/types.ts
- `PublisherNavViewProps` --references--> `Publisher` [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher` [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts

## Import Cycles

- None detected.

## Communities (38 total, 14 thin omitted)

### Community 0 - "Routes & Page Containers"

Cohesion: 0.32
Nodes (5): getRouter(), Register, Register, routeTree, getContext()

### Community 1 - "HTTP Client & API Types"

Cohesion: 0.08
Nodes (38): ApiError, client, http, META, MOCK_PRODUCTS, wrap(), wrapEnvelope(), ApiResponse (+30 more)

### Community 2 - "Catalog Browse Components"

Cohesion: 0.07
Nodes (36): ProductFilters, Route, Route, Route, AdminProductsView(), DEFAULTS, FormValues, schema (+28 more)

### Community 3 - "Cart View & Stories"

Cohesion: 0.06
Nodes (36): Route, mockConfirmCardPayment, mockStripe, CartPage(), CartView(), Props, Empty, items (+28 more)

### Community 4 - "Publisher Nav UI"

Cohesion: 0.17
Nodes (11): Publisher, PublisherNavView(), PublisherNavViewProps, Default, GameActive, Loading, meta, PublisherActive (+3 more)

### Community 5 - "Catalog View Tests"

Cohesion: 0.09
Nodes (44): mockUseAuth, mockUseUser, twoOrders, mockGames, mockUseAuth, mockUseUser, twoCharacters, mockPublishers (+36 more)

### Community 6 - "Product Detail View"

Cohesion: 0.23
Nodes (6): SKU, Props, ProductDetailView(), ProductDetailViewProps, product, formatVariant()

### Community 7 - "Account & Auth UI"

Cohesion: 0.15
Nodes (7): Route, Route, AuthPageView(), Props, SignIn, SignUp, Story

### Community 8 - "Product Catalog View"

Cohesion: 0.06
Nodes (30): accountAccountOrdersRoute, adminAdminCharactersRoute, adminAdminGamesRoute, adminAdminOrdersRoute, adminAdminProductsRoute, adminAdminPublishersRoute, adminAdminRoute, adminAdminRouteChildren (+22 more)

### Community 9 - "Orders Module"

Cohesion: 0.09
Nodes (21): AccountOrdersPage(), Route, AdminOrdersPage(), Route, Route, AdminOrdersView(), COL_FLEX, COLS (+13 more)

### Community 10 - "Facet Filter Stories"

Cohesion: 0.13
Nodes (13): FacetFilterView(), characters, games, GameSelected, MultipleActive, NoSelection, Story, teams (+5 more)

### Community 11 - "App Shell & Theme"

Cohesion: 0.18
Nodes (7): Route, Route, Route, AdminLayout(), NAV_ITEMS, NavItem, Props

### Community 12 - "Checkout Form Stories"

Cohesion: 0.13
Nodes (18): ShippingAddress, Route, CheckoutFormView(), Props, DEFAULTS, FormValues, schema, Empty (+10 more)

### Community 13 - "Community 13"

Cohesion: 0.18
Nodes (11): Product, ProductCatalogView(), ProductCatalogViewProps, Default, Empty, Loading, meta, NoImages (+3 more)

### Community 14 - "Community 14"

Cohesion: 0.15
Nodes (9): Route, Route, Route, Route, Route, Route, Route, Route (+1 more)

### Community 15 - "Community 15"

Cohesion: 0.31
Nodes (9): AdminCharactersView(), DEFAULTS, FormValues, schema, selectStyle, useCreateCharacter(), useDeleteCharacter(), useGames() (+1 more)

### Community 16 - "Community 16"

Cohesion: 0.29
Nodes (8): Route, AdminPublishersView(), DEFAULTS, FormValues, schema, useCreatePublisher(), useDeletePublisher(), useUpdatePublisher()

### Community 17 - "Community 17"

Cohesion: 0.20
Nodes (9): FormField(), Label, Props, Default, NoLabel, Story, WithError, WithFlex (+1 more)

### Community 18 - "Community 18"

Cohesion: 0.26
Nodes (9): Route, AdminSkusView(), EnrichedSku, DEFAULTS, FormValues, schema, useCreateSku(), useDeleteSku() (+1 more)

### Community 19 - "Community 19"

Cohesion: 0.26
Nodes (9): Route, AdminTeamsView(), DEFAULTS, FormValues, schema, selectStyle, useCreateTeam(), useDeleteTeam() (+1 more)

### Community 20 - "Community 20"

Cohesion: 0.26
Nodes (9): Route, AdminGamesView(), DEFAULTS, FormValues, schema, selectStyle, useCreateGame(), useDeleteGame() (+1 more)

### Community 25 - "Community 25"

Cohesion: 0.21
Nodes (8): GamePageView(), GamePageViewProps, Loaded, Loading, meta, Story, Props, QueryError()

### Community 29 - "Community 29"

Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

### Community 31 - "Community 31"

Cohesion: 0.32
Nodes (5): PublisherPageView(), Loaded, Loading, meta, Story

## Knowledge Gaps

- **199 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `OrderLine`, `ORDER_STATUSES` (+194 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `FormField()` connect `Community 17` to `Catalog Browse Components`, `Checkout Form Stories`, `Community 15`, `Community 16`, `Community 18`, `Community 19`, `Community 20`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `Product` connect `Community 13` to `HTTP Client & API Types`, `Catalog Browse Components`, `Catalog View Tests`, `Product Detail View`, `Community 18`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `renderWithProviders()` connect `Catalog Browse Components` to `Cart View & Stories`, `Catalog View Tests`, `Product Detail View`, `Orders Module`, `Facet Filter Stories`, `Community 13`, `Community 17`, `Community 25`, `Community 31`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _199 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.08163265306122448 - nodes in this community are weakly interconnected._
- **Should `Catalog Browse Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07086197778952935 - nodes in this community are weakly interconnected._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.060496067755595885 - nodes in this community are weakly interconnected._
