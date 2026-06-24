# Graph Report - merch-shop  (2026-06-24)

## Corpus Check
- 59 files · ~10,836 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 229 nodes · 417 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4c2acec8`
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
1. `FileRoutesByPath` - 13 edges
2. `client` - 9 edges
3. `Product` - 9 edges
4. `Publisher` - 7 edges
5. `publishers` - 6 edges
6. `clearCart()` - 6 edges
7. `renderRoute()` - 6 edges
8. `Team` - 5 edges
9. `Character` - 5 edges
10. `ProductCatalog()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/components/ui/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/components/ui/PublisherPageView.tsx → src/api/types.ts
- `ProductCatalogViewProps` --references--> `Product`  [EXTRACTED]
  src/components/ui/ProductCatalogView.tsx → src/api/types.ts
- `ProductDetailViewProps` --references--> `Product`  [EXTRACTED]
  src/components/ui/ProductDetailView.tsx → src/api/types.ts
- `CheckoutForm()` --calls--> `clearCart()`  [EXTRACTED]
  src/components/CheckoutPage.tsx → src/store/cart.ts

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "Route Definitions"
Cohesion: 0.06
Nodes (36): CartPage(), Route, Route, Route, Route, Route, Route, Route (+28 more)

### Community 1 - "API Client & Types"
Cohesion: 0.18
Nodes (12): Product, ProductFilters, Props, ProductCatalogView(), ProductCatalogViewProps, Default, Empty, Loading (+4 more)

### Community 2 - "Test Mocks & Handlers"
Cohesion: 0.20
Nodes (8): PublisherNavView(), PublisherNavViewProps, Default, GameActive, Loading, meta, PublisherActive, Story

### Community 3 - "Cart & Product Detail"
Cohesion: 0.11
Nodes (20): ShippingAddress, CheckoutForm(), CheckoutPage(), FieldErrors, stripePromise, Route, mockConfirmCardPayment, mockStripe (+12 more)

### Community 4 - "Game & Publisher Nav"
Cohesion: 0.16
Nodes (11): publishers, Loaded, Loading, meta, Story, PublisherPageView(), PublisherPageViewProps, Loaded (+3 more)

### Community 5 - "Catalog & Filters"
Cohesion: 0.12
Nodes (14): client, FacetFilter(), ProductCatalog(), filterSearch, Route, FacetFilterView(), characters, games (+6 more)

### Community 6 - "Publisher Page Views"
Cohesion: 0.60
Nodes (3): OrderConfirmationPage(), Route, searchSchema

### Community 7 - "App Shell & Theme"
Cohesion: 0.27
Nodes (4): GlobalNav(), MyRouterContext, env, system

### Community 8 - "Product Detail View"
Cohesion: 0.19
Nodes (7): SKU, ProductDetail(), Props, Route, formatVariant(), ProductDetailView(), ProductDetailViewProps

### Community 9 - "Environment Config"
Cohesion: 0.11
Nodes (20): ApiError, http, Character, CreateOrderRequest, CreateOrderResponse, Game, Order, OrderLine (+12 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (13): GamePage(), Props, NavLink, Props, PublisherNav(), Props, PublisherPage(), mockUseAuth (+5 more)

## Knowledge Gaps
- **77 isolated node(s):** `http`, `OrderLine`, `Order`, `stripePromise`, `FieldErrors` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `client` connect `Catalog & Filters` to `API Client & Types`, `Cart & Product Detail`, `Product Detail View`, `Environment Config`, `Community 10`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `publishers` connect `Game & Publisher Nav` to `Environment Config`, `Test Mocks & Handlers`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Product` connect `API Client & Types` to `Product Detail View`, `Environment Config`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `http`, `OrderLine`, `Order` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Route Definitions` be split into smaller, more focused modules?**
  _Cohesion score 0.05939716312056738 - nodes in this community are weakly interconnected._
- **Should `Cart & Product Detail` be split into smaller, more focused modules?**
  _Cohesion score 0.11290322580645161 - nodes in this community are weakly interconnected._
- **Should `Catalog & Filters` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._