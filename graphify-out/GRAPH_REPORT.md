# Graph Report - .  (2026-06-25)

## Corpus Check
- Corpus is ~13,669 words - fits in a single context window. You may not need a graph.

## Summary
- 301 nodes · 559 edges · 13 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `FileRoutesByPath` - 14 edges
2. `renderWithProviders()` - 10 edges
3. `Product` - 9 edges
4. `Publisher` - 7 edges
5. `ProductCatalog()` - 7 edges
6. `renderRoute()` - 7 edges
7. `publishers` - 6 edges
8. `FacetFilter()` - 6 edges
9. `PublisherNav()` - 6 edges
10. `usePublishers()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `CheckoutForm()` --calls--> `clearCart()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/store/cart.ts
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductCatalogView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `Product`  [EXTRACTED]
  src/modules/catalog/components/ProductDetailView.tsx → src/api/types.ts
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts

## Import Cycles
- None detected.

## Communities (13 total, 0 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.05
Nodes (39): CartPage(), CheckoutPage(), Route, Route, Route, filterSearch, Route, Route (+31 more)

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.07
Nodes (31): ApiError, client, http, Character, CreateOrderRequest, CreateOrderResponse, Game, Order (+23 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.14
Nodes (21): FacetFilter(), GamePage(), Props, ProductCatalog(), Props, ProductDetail(), Props, NavLink (+13 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.12
Nodes (20): CartView(), Props, Empty, items, MultipleItems, SingleItem, Story, items (+12 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.12
Nodes (16): Publisher, PublisherNavView(), PublisherNavViewProps, Default, GameActive, Loading, meta, PublisherActive (+8 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.13
Nodes (14): characters, games, renderFilter(), teams, GamePageView(), GamePageViewProps, Loaded, Loading (+6 more)

### Community 6 - "Product Detail View"
Cohesion: 0.13
Nodes (12): SKU, ProductDetailView(), ProductDetailViewProps, Default, EditionVariants, Error, Loading, NoImage (+4 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.17
Nodes (7): AuthPageView(), Props, SignIn, SignUp, Story, Route, Route

### Community 8 - "Product Catalog View"
Cohesion: 0.18
Nodes (11): Product, ProductCatalogView(), ProductCatalogViewProps, Default, Empty, Loading, meta, NoImages (+3 more)

### Community 9 - "Orders Module"
Cohesion: 0.23
Nodes (6): OrderConfirmationPage(), Props, useOrders(), AccountOrdersPage(), Route, searchSchema

### Community 10 - "Facet Filter Stories"
Cohesion: 0.20
Nodes (9): FacetFilterView(), characters, games, GameSelected, MultipleActive, NoSelection, Story, teams (+1 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.27
Nodes (4): GlobalNav(), MyRouterContext, env, system

### Community 12 - "Checkout Form Stories"
Cohesion: 0.25
Nodes (7): Empty, filledFields, FilledOut, PaymentDeclined, Story, Submitting, ValidationErrors

## Knowledge Gaps
- **112 isolated node(s):** `http`, `OrderLine`, `worker`, `RawProduct`, `games` (+107 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderWithProviders()` connect `Catalog View Tests` to `Catalog Browse Components`, `Cart View & Stories`, `Publisher Nav UI`, `Product Detail View`, `Product Catalog View`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Order` connect `HTTP Client & API Types` to `Orders Module`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `http`, `OrderLine`, `worker` to the rest of the system?**
  _112 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Routes & Page Containers` be split into smaller, more focused modules?**
  _Cohesion score 0.05012531328320802 - nodes in this community are weakly interconnected._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.07227891156462585 - nodes in this community are weakly interconnected._
- **Should `Catalog Browse Components` be split into smaller, more focused modules?**
  _Cohesion score 0.13911290322580644 - nodes in this community are weakly interconnected._
- **Should `Cart View & Stories` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._