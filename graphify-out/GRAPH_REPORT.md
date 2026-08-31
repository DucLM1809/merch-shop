# Graph Report - merch-shop  (2026-08-31)

## Corpus Check
- 273 files · ~70,759 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1008 nodes · 2554 edges · 62 communities (42 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `35ee2ca8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Routes & Page Containers
- HTTP Client & API Types
- Catalog Browse Components
- Cart View & Stories
- Publisher Nav UI
- Catalog View Tests
- Product Detail View
- Account & Auth UI
- Product Catalog View
- Orders Module
- Facet Filter Stories
- App Shell & Theme
- Checkout Form Stories
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- AdminTeamsView.tsx
- useFormatPrice
- AdminGamesView.tsx
- AdminProductsView.tsx
- Community 24
- AuthPageView
- Community 26
- Community 27
- Community 28
- useAuth
- AdminPublishersView.tsx
- AdminOrdersView.tsx
- Route
- Community 33
- Community 34
- Community 35
- __root.tsx
- FormField.tsx
- Route
- Route
- account.orders.lazy.tsx
- localeLinkGuard.test.tsx
- Route
- Route
- Route
- Route
- $locale.tsx
- ResetPasswordForm.tsx
- i18next.d.ts
- $locale/index.tsx
- $locale/index.tsx
- ColorModeToggle.tsx
- CartView.tsx
- SignInForm.tsx
- cart/hooks/index.ts
- AdminGamesView.tsx
- AdminGamesView.tsx
- EmptyState.tsx
- SignInForm.tsx
- client
- Route
- Route

## God Nodes (most connected - your core abstractions)
1. `useLocale()` - 49 edges
2. `renderRoute()` - 33 edges
3. `FileRoutesByPath` - 31 edges
4. `renderWithProviders()` - 28 edges
5. `server` - 22 edges
6. `useFormatPrice()` - 20 edges
7. `envelope()` - 19 edges
8. `useAuth()` - 17 edges
9. `mockSignedIn()` - 16 edges
10. `EmptyState()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `PublisherNavViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherNavView.tsx → src/api/types.ts
- `PublisherPageViewProps` --references--> `Publisher`  [EXTRACTED]
  src/modules/catalog/components/PublisherPageView.tsx → src/api/types.ts
- `payLabel()` --calls--> `formatPrice()`  [EXTRACTED]
  src/routes/$locale/(checkout)/checkout.test.tsx → src/i18n/formatPrice.ts
- `CartRow()` --calls--> `useFormatPrice()`  [EXTRACTED]
  src/modules/cart/components/CartView.tsx → src/i18n/useFormatPrice.ts
- `CheckoutForm()` --calls--> `useLocale()`  [EXTRACTED]
  src/modules/checkout/components/CheckoutPage.tsx → src/i18n/useLocale.ts

## Import Cycles
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/$publisherSlug.$gameSlug.products.$productSlug.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/(catalog)/shop.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`
- 5-file cycle: `src/modules/catalog/components/PublisherNav.tsx -> src/modules/catalog/components/PublisherNavView.tsx -> src/routeTree.gen.ts -> src/routes/$locale/index.tsx -> src/modules/catalog/index.ts -> src/modules/catalog/components/PublisherNav.tsx`

## Communities (62 total, 20 thin omitted)

### Community 0 - "Routes & Page Containers"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 1 - "HTTP Client & API Types"
Cohesion: 0.06
Nodes (40): ORDER_STATUSES, OrderStatus, Badge(), BadgeProps, BadgeTone, Count, Status, StatusDanger (+32 more)

### Community 2 - "Catalog Browse Components"
Cohesion: 0.21
Nodes (11): Props, DEFAULTS, FormValues, schema, DEFAULTS, FormValues, schema, SignUpForm() (+3 more)

### Community 3 - "Cart View & Stories"
Cohesion: 0.21
Nodes (12): AdminConfirmButton(), AdminConfirmButtonProps, AdminSkusView(), COLUMNS, EnrichedSku, DEFAULTS, FormValues, schema (+4 more)

### Community 4 - "Publisher Nav UI"
Cohesion: 0.06
Nodes (48): ApiError, client, http, loadGames(), loadRawPublishers(), normalizeProduct(), normalizeProductMutationResponse(), normalizeSku() (+40 more)

### Community 5 - "Catalog View Tests"
Cohesion: 0.18
Nodes (8): FacetDrawerProps, FacetFilterView(), FacetGroupProps, characters, games, renderFilter(), teams, renderWithProviders()

### Community 6 - "Product Detail View"
Cohesion: 0.07
Nodes (41): LocaleSwitcher(), LocaleSwitcherProps, dateLocaleOf(), formatDate(), formatterFor(), formatters, formatPrice(), formatterFor() (+33 more)

### Community 7 - "Account & Auth UI"
Cohesion: 0.31
Nodes (9): AdminCharactersView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateCharacter(), useDeleteCharacter(), useUpdateCharacter() (+1 more)

### Community 8 - "Product Catalog View"
Cohesion: 0.04
Nodes (44): FileRoutesByFullPath, FileRoutesByTo, IndexRoute, LocaleaccountAccountOrdersIndexRoute, LocaleaccountAccountOrdersOrderIdRoute, LocaleaccountAccountOrdersRoute, LocaleaccountAccountOrdersRouteChildren, LocaleaccountAccountOrdersRouteWithChildren (+36 more)

### Community 9 - "Orders Module"
Cohesion: 0.06
Nodes (45): ProductFilters, useLocale(), FacetFilter(), FacetFilterProps, FacetFilterSearch, GamePage(), Props, ProductCatalog() (+37 more)

### Community 10 - "Facet Filter Stories"
Cohesion: 0.16
Nodes (22): Order, adminAccount, buyerAccount, mockSignedIn(), envelope(), toRawOrder(), server, twoOrders (+14 more)

### Community 11 - "App Shell & Theme"
Cohesion: 0.20
Nodes (15): refreshAccessToken(), mockAccount, resetAuthMockState(), accountKeys, bootstrapAuth(), ADR-0015, useDeleteAccount(), UseVerifyEmailCallbacks (+7 more)

### Community 12 - "Checkout Form Stories"
Cohesion: 0.17
Nodes (10): AuthPageView(), ResetPasswordForm(), Props, VerifyEmailView(), VerifyStatus, useResetPassword(), useVerifyEmail(), Route (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.13
Nodes (19): CheckoutFormView(), Props, DEFAULTS, FormValues, schema, VALIDATION_KEYS, ValidationKey, Empty (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (12): Route, Route, Route, Route, Route, Route, Route, Route (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (10): FormField(), Label, Props, Default, NoLabel, Required, Story, WithError (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.27
Nodes (6): BreadcrumbItem, isOptionAvailable(), ProductDetailView(), ProductDetailViewProps, RenderBreadcrumbLink, uniqueValues()

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (5): JERSEY, EMPTY_CART_TITLE, flattenSpaces(), priceText(), renderRoute()

### Community 18 - "Community 18"
Cohesion: 0.07
Nodes (29): Product, buildOptimizedImageUrl(), buildVercelImageUrl(), OptimizedImage(), OptimizedImageProps, ProductCard(), ProductCardProps, ADR-0008 (+21 more)

### Community 19 - "Community 19"
Cohesion: 0.26
Nodes (9): useAccount(), useAuth(), AdminGuard(), Route, Route, SignInPage(), Route, SignUpPage() (+1 more)

### Community 20 - "AdminTeamsView.tsx"
Cohesion: 0.23
Nodes (10): AdminRowActions(), AdminTeamsView(), COLUMNS, DEFAULTS, FormValues, schema, useCreateTeam(), useDeleteTeam() (+2 more)

### Community 21 - "useFormatPrice"
Cohesion: 0.24
Nodes (5): Breadcrumb(), BreadcrumbProps, ProductPage, Story, TwoLevels

### Community 22 - "AdminGamesView.tsx"
Cohesion: 0.22
Nodes (8): characters, games, GameSelected, MultipleActive, NoSelection, Story, teams, TeamSelected

### Community 23 - "AdminProductsView.tsx"
Cohesion: 0.22
Nodes (11): AdminProductsView(), COLUMNS, DEFAULTS, FormValues, schema, SECTION_LABEL_PROPS, shortId(), useCreateProduct() (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.08
Nodes (32): ColorModeOption, ColorModeToggle(), ColorModeToggleProps, isColorModeOption(), MODE_ICON, env, worker, handlers (+24 more)

### Community 25 - "AuthPageView"
Cohesion: 0.32
Nodes (3): Toaster, breadcrumbItems, product

### Community 27 - "Community 27"
Cohesion: 0.48
Nodes (5): ForgotPasswordForm(), DEFAULTS, FormValues, schema, useForgotPassword()

### Community 29 - "useAuth"
Cohesion: 0.15
Nodes (12): BADGE_SIZE, EmptyState(), EmptyStateProps, EmptyStateSize, REDUCED_MOTION_OVERRIDE, Small, Story, TitleOnly (+4 more)

### Community 30 - "AdminPublishersView.tsx"
Cohesion: 0.06
Nodes (27): Props, QueryError(), mockPublishers, GamePageView(), GamePageViewProps, Loaded, Loading, meta (+19 more)

### Community 31 - "AdminOrdersView.tsx"
Cohesion: 0.18
Nodes (10): Character, Game, Publisher, Team, FacetFilterViewProps, mockPublishers, twoGames, mockGames (+2 more)

### Community 32 - "Route"
Cohesion: 0.16
Nodes (16): AdminPublishersView(), COLUMNS, DEFAULTS, FormValues, schema, AdminColumn, AdminRowActionsProps, AdminTableCell() (+8 more)

### Community 33 - "Community 33"
Cohesion: 0.18
Nodes (8): GlobalNav(), UtilityShelf(), PANEL_INLINE_PADDING, Props, SignIn, SignUp, Story, useLogout()

### Community 36 - "__root.tsx"
Cohesion: 0.12
Nodes (21): buildTree(), seededItem, getI18n(), instances, findKeyParityGaps(), flattenKeys(), formatParityGaps(), isTree() (+13 more)

### Community 37 - "FormField.tsx"
Cohesion: 0.28
Nodes (6): Card(), CardProps, Default, Interactive, NoClipCorner, Story

### Community 40 - "account.orders.lazy.tsx"
Cohesion: 0.07
Nodes (36): CartPage(), CartRow(), CartRowProps, CartView(), Props, Empty, items, MultipleItems (+28 more)

### Community 42 - "Route"
Cohesion: 0.10
Nodes (19): Account, LoginDto, PaymentIntentResponse, RawOrder, RegisterDto, ResetPasswordDto, SyncCartItem, VerifyEmailDto (+11 more)

### Community 43 - "Route"
Cohesion: 0.24
Nodes (7): MAX_WIDTH, PageContainer(), PageContainerProps, Large, Medium, Small, Story

### Community 48 - "i18next.d.ts"
Cohesion: 0.60
Nodes (3): CustomTypeOptions, i18next, GeneratedResources

### Community 56 - "AdminGamesView.tsx"
Cohesion: 0.22
Nodes (11): AdminFormSheet(), AdminFormSheetProps, AdminGamesView(), COLUMNS, DEFAULTS, FormValues, schema, AdminTable() (+3 more)

### Community 57 - "AdminGamesView.tsx"
Cohesion: 0.16
Nodes (9): AdminOrdersView(), COLUMNS, fmtDate(), Props, RETRYABLE_STATUSES, Route, Route, Route (+1 more)

### Community 62 - "EmptyState.tsx"
Cohesion: 0.22
Nodes (8): Default, EditionVariants, Error, Loading, NoImage, NoSkus, product, Story

### Community 69 - "SignInForm.tsx"
Cohesion: 0.48
Nodes (5): DEFAULTS, FormValues, schema, SignInForm(), useLogin()

## Knowledge Gaps
- **321 isolated node(s):** `META`, `MOCK_PRODUCTS`, `http`, `RetryableConfig`, `ADR-0015` (+316 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale()` connect `Orders Module` to `Community 33`, `Catalog Browse Components`, `HTTP Client & API Types`, `SignInForm.tsx`, `Product Detail View`, `account.orders.lazy.tsx`, `Checkout Form Stories`, `Community 13`, `Community 18`, `Community 19`, `Community 24`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `renderRoute()` connect `Community 17` to `__root.tsx`, `Product Detail View`, `account.orders.lazy.tsx`, `Orders Module`, `Facet Filter Stories`, `AdminOrdersView.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `FormField()` connect `Community 15` to `Route`, `Catalog Browse Components`, `Cart View & Stories`, `SignInForm.tsx`, `Account & Auth UI`, `Community 13`, `AdminTeamsView.tsx`, `AdminProductsView.tsx`, `AdminGamesView.tsx`, `Community 27`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `META`, `MOCK_PRODUCTS`, `http` to the rest of the system?**
  _321 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `HTTP Client & API Types` be split into smaller, more focused modules?**
  _Cohesion score 0.057859703020993344 - nodes in this community are weakly interconnected._
- **Should `Publisher Nav UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06078316773816481 - nodes in this community are weakly interconnected._
- **Should `Product Detail View` be split into smaller, more focused modules?**
  _Cohesion score 0.07341269841269842 - nodes in this community are weakly interconnected._