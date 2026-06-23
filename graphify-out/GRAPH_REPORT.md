# Graph Report - .  (2026-06-23)

## Corpus Check
- Corpus is ~8,360 words - fits in a single context window. You may not need a graph.

## Summary
- 193 nodes · 349 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `Product` - 9 edges
2. `FileRoutesByPath` - 9 edges
3. `client` - 8 edges
4. `Publisher` - 7 edges
5. `publishers` - 6 edges
6. `Team` - 5 edges
7. `Character` - 5 edges
8. `ProductCatalog()` - 5 edges
9. `updateQuantity()` - 5 edges
10. `renderWithProviders()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/components/ui/ProductCatalogView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `Product`  [EXTRACTED]
  src/components/ui/ProductDetailView.tsx → src/api/types.ts
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/components/ui/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/components/ui/PublisherPageView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `SKU`  [EXTRACTED]
  src/components/ui/ProductDetailView.tsx → src/api/types.ts

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "Route Definitions"
Cohesion: 0.08
Nodes (31): Route, Route, Route, Route, Route, Route, Route, Route (+23 more)

### Community 1 - "API Client & Types"
Cohesion: 0.12
Nodes (20): ApiError, client, http, Character, Game, Product, ProductFilters, Team (+12 more)

### Community 2 - "Test Mocks & Handlers"
Cohesion: 0.10
Nodes (19): Publisher, worker, characters, games, handlers, products, publishers, RawProduct (+11 more)

### Community 3 - "Cart & Product Detail"
Cohesion: 0.15
Nodes (16): CartPage(), ProductDetail(), Props, addToCart(), CartItem, CartState, cartStore, clearCart() (+8 more)

### Community 4 - "Game & Publisher Nav"
Cohesion: 0.13
Nodes (13): GamePage(), Props, NavLink, Props, PublisherNav(), renderRoute(), renderWithProviders(), GamePageView() (+5 more)

### Community 5 - "Catalog & Filters"
Cohesion: 0.13
Nodes (12): FacetFilter(), ProductCatalog(), filterSearch, FacetFilterView(), characters, games, GameSelected, MultipleActive (+4 more)

### Community 6 - "Publisher Page Views"
Cohesion: 0.21
Nodes (7): Props, PublisherPage(), PublisherPageView(), Loaded, Loading, meta, Story

### Community 7 - "App Shell & Theme"
Cohesion: 0.32
Nodes (3): GlobalNav(), MyRouterContext, system

### Community 8 - "Product Detail View"
Cohesion: 0.33
Nodes (3): SKU, ProductDetailView(), ProductDetailViewProps

## Knowledge Gaps
- **65 isolated node(s):** `http`, `Props`, `Props`, `NavLink`, `Props` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Product` connect `API Client & Types` to `Product Detail View`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `client` connect `API Client & Types` to `Test Mocks & Handlers`, `Cart & Product Detail`, `Game & Publisher Nav`, `Catalog & Filters`, `Publisher Page Views`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `publishers` connect `Test Mocks & Handlers` to `Game & Publisher Nav`, `Publisher Page Views`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `http`, `Props`, `Props` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Route Definitions` be split into smaller, more focused modules?**
  _Cohesion score 0.07681365576102418 - nodes in this community are weakly interconnected._
- **Should `API Client & Types` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._
- **Should `Test Mocks & Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.0960591133004926 - nodes in this community are weakly interconnected._