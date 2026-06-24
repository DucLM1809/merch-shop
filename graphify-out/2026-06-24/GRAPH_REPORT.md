# Graph Report - merch-shop  (2026-06-24)

## Corpus Check
- 54 files · ~9,340 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 204 nodes · 367 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0fcb9f89`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Route Definitions|Route Definitions]]
- [[_COMMUNITY_API Client & Types|API Client & Types]]
- [[_COMMUNITY_Test Mocks & Handlers|Test Mocks & Handlers]]
- [[_COMMUNITY_Cart & Product Detail|Cart & Product Detail]]
- [[_COMMUNITY_Game & Publisher Nav|Game & Publisher Nav]]
- [[_COMMUNITY_Catalog & Filters|Catalog & Filters]]
- [[_COMMUNITY_Publisher Page Views|Publisher Page Views]]
- [[_COMMUNITY_App Shell & Theme|App Shell & Theme]]
- [[_COMMUNITY_Product Detail View|Product Detail View]]
- [[_COMMUNITY_Environment Config|Environment Config]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `FileRoutesByPath` - 11 edges
2. `Product` - 9 edges
3. `client` - 8 edges
4. `Publisher` - 7 edges
5. `publishers` - 6 edges
6. `Team` - 5 edges
7. `Character` - 5 edges
8. `ProductCatalog()` - 5 edges
9. `updateQuantity()` - 5 edges
10. `renderWithProviders()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Props` --references--> `Product`  [EXTRACTED]
  src/components/ProductCatalog.tsx → src/api/types.ts
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/components/ui/ProductCatalogView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `Product`  [EXTRACTED]
  src/components/ui/ProductDetailView.tsx → src/api/types.ts
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/components/ui/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/components/ui/PublisherPageView.tsx → src/api/types.ts

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "Route Definitions"
Cohesion: 0.06
Nodes (31): CartPage(), GamePage(), PublisherPage(), Route, Route, Route, Route, Route (+23 more)

### Community 1 - "API Client & Types"
Cohesion: 0.19
Nodes (10): Product, ProductCatalogView(), ProductCatalogViewProps, Default, Empty, Loading, meta, NoImages (+2 more)

### Community 2 - "Test Mocks & Handlers"
Cohesion: 0.12
Nodes (16): Publisher, publishers, PublisherNavView(), PublisherNavViewProps, Default, GameActive, Loading, meta (+8 more)

### Community 3 - "Cart & Product Detail"
Cohesion: 0.24
Nodes (12): addToCart(), CartItem, CartState, cartStore, clearCart(), getSubtotal(), removeFromCart(), sku1 (+4 more)

### Community 4 - "Game & Publisher Nav"
Cohesion: 0.28
Nodes (6): GamePageView(), GamePageViewProps, Loaded, Loading, meta, Story

### Community 5 - "Catalog & Filters"
Cohesion: 0.20
Nodes (9): FacetFilterView(), characters, games, GameSelected, MultipleActive, NoSelection, Story, teams (+1 more)

### Community 6 - "Publisher Page Views"
Cohesion: 0.16
Nodes (13): ApiError, client, http, ProductFilters, FacetFilter(), Props, ProductCatalog(), Props (+5 more)

### Community 7 - "App Shell & Theme"
Cohesion: 0.27
Nodes (4): GlobalNav(), MyRouterContext, env, system

### Community 8 - "Product Detail View"
Cohesion: 0.19
Nodes (7): SKU, ProductDetail(), Props, Route, formatVariant(), ProductDetailView(), ProductDetailViewProps

### Community 9 - "Environment Config"
Cohesion: 0.15
Nodes (13): Character, Game, Team, worker, characters, games, handlers, products (+5 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (10): mockUseAuth, mockUseUser, getRouter(), Register, Register, routeTree, renderRoute(), renderWithProviders() (+2 more)

## Knowledge Gaps
- **68 isolated node(s):** `http`, `Props`, `Props`, `NavLink`, `Props` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `API Client & Types` to `Product Detail View`, `Environment Config`, `Publisher Page Views`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `publishers` connect `Test Mocks & Handlers` to `Environment Config`, `Community 10`, `Game & Publisher Nav`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `client` connect `Publisher Page Views` to `Product Detail View`, `Environment Config`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `http`, `Props`, `Props` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Route Definitions` be split into smaller, more focused modules?**
  _Cohesion score 0.06161616161616162 - nodes in this community are weakly interconnected._
- **Should `Test Mocks & Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
- **Should `Environment Config` be split into smaller, more focused modules?**
  _Cohesion score 0.1471861471861472 - nodes in this community are weakly interconnected._