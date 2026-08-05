# Data Model: APPLAND Home Redesign

**Feature**: 001-appland-home-redesign

**Date**: 2026-08-04
**Persistence**: None. This is immutable, build-time Home configuration plus transient UI state.

## Design principles

- Business copy lives in one typed Spanish configuration, not in templates.
- An item is rendered only when its publication rule permits it.
- Optional media and destinations never create an empty placeholder.
- Stable ids drive fragments, ARIA relationships and tests.
- The Home model does not reuse the legacy translation payload because that payload contains a different service catalog and unapproved claims.

## Core types

### PublicationStatus

Allowed values:

- approved: may be rendered when every required field is valid.
- pending: retained as a future configuration entry but never rendered publicly.
- withdrawn: previously known but explicitly excluded from publication.

The public selectors return approved items only.

### HomeRegion

Represents one ordered functional region.

| Field | Type | Required | Rule |
|---|---|---:|---|
| id | HomeSectionId | Yes | Unique stable fragment |
| order | integer | Yes | Matches the approved relative order |
| title | string | Yes except Hero | Official copy |
| eyebrow | string | No | Visual label, not new business content |
| visibility | always or when-approved-items | Yes | Clients and products may be conditional on approved items |
| labelledBy | string | Yes | References a visible heading id |

HomeSectionId values:

1. inicio
2. clientes
3. desafios
4. servicios
5. casos
6. ia
7. productos
8. por-que-appland
9. equipo-global
10. contacto

The footer is global and not a HomeSectionId. `ObservedRegionId` is therefore `HomeSectionId | 'footer'` for active-header observation only. Every rendered HomeRegion registers its HomeSectionId with the shared section-state service; AppComponent registers the global footer as `footer`. Registration does not imply route eligibility: the footer participates in active-header calculation only while the active route is `/`. If clientes or productos is hidden, it is not registered and later regions retain their relative order.

### NavigationItem

| Field | Type | Required | Rule |
|---|---|---:|---|
| id | string | Yes | Unique in its navigation group |
| label | string | Yes | Spanish visible label |
| fragment | HomeSectionId | Yes | Must identify a rendered destination |
| prominent | boolean | Yes | Distinguishes a conversion action from a text link |

Required header mapping:

- Inicio → inicio
- Servicios → servicios
- Casos de éxito → casos
- Nosotros → por-que-appland
- Contacto → contacto

No item maps to an additional Nosotros region.

Observed-region to active-header mapping while the active route is `/`:

| Observed region | Active header item |
|---|---|
| inicio | Inicio |
| clientes | Inicio |
| desafios | Servicios |
| servicios | Servicios |
| casos | Casos de éxito |
| ia | Servicios |
| productos | Servicios |
| por-que-appland | Nosotros |
| equipo-global | Nosotros |
| contacto | Contacto |
| footer | Contacto |

At most one header item is active on `/`. When two regions are partially visible, the active region is the one whose top most recently crossed the 140 px activation line defined by the technical plan. On any route other than `/`, the mapping is inactive and every header item has no fragment-derived active state.

### ApprovedAsset

| Field | Type | Required | Rule |
|---|---|---:|---|
| src | local asset path | Yes when object exists | Must resolve under src/assets |
| width | positive integer | Yes | Intrinsic width |
| height | positive integer | Yes | Intrinsic height |
| alt | string | Conditional | Required for informative media; empty for decorative media |
| decorative | boolean | Yes | Controls assistive exposure |
| publicationStatus | PublicationStatus | Yes | Must be approved to render |

No remote source is valid for a required Home asset.

### ApprovedDestination

| Field | Type | Required | Rule |
|---|---|---:|---|
| kind | fragment, external, email, phone or whatsapp | Yes | Determines safe rendering |
| value | string | Yes | Nonempty and syntactically valid |
| publicationStatus | PublicationStatus | Yes | External/social/legal destinations render only when approved |
| newContext | boolean | Yes | External/WhatsApp may open a new context with rel protection |

## Business entities

### HeroContent

| Field | Type | Required |
|---|---|---:|
| title | string | Yes |
| subtitle | string | Yes |
| primaryAction | ConversionAction | Yes |
| servicesAction | ConversionAction | Yes |
| whatsappAction | ConversionAction | No |
| decorativeAsset | ApprovedAsset | No |

The title and subtitle are the exact approved PDF copy. Hero contains the single page h1.

### Client

| Field | Type | Required | Visibility rule |
|---|---|---:|---|
| id | string | Yes | Stable |
| name | string | Yes | Official company name |
| logo | ApprovedAsset | Yes | Must exist and be approved |
| publicationStatus | PublicationStatus | Yes | approved only |

Ficohsa, Grupo Terra, Tigo, Pepsi, Toyota and Avianca are candidates named by the brief. A candidate without an approved local logo is not visible.

### Challenge

| Field | Type | Required |
|---|---|---:|
| id | string | Yes |
| problem | string | Yes |
| response | string | Yes |
| visualKey | internal icon key | No |

Exactly five approved challenge/response pairs are configured.

### Service

| Field | Type | Required |
|---|---|---:|
| id | string | Yes |
| name | string | Yes |
| summary | string | Yes |
| visualKey | internal visual key | No |

Exactly five services are configured: Desarrollo de Software, Inteligencia Artificial, Staff Augmentation, Automatización de Procesos and Consultoría Tecnológica. Additional detail is not added unless approved as business copy.

### CaseStudy

| Field | Type | Required | Visibility rule |
|---|---|---:|---|
| id | string | Yes | Stable |
| name | string | Yes | Official project/client label |
| summary | string | Yes | Official brief description |
| media | ApprovedAsset | No | Omit media region if absent |
| destination | ApprovedDestination | No | Omit “Ver caso” if absent/unapproved |
| publicationStatus | PublicationStatus | Yes | approved only |

Five entries are initially configured from the brief: Toyota, Avianca, Dilo, Telemedicine Platform and Espresso Americano.

### AiApplication

| Field | Type | Required |
|---|---|---:|
| id | string | Yes |
| label | string | Yes |
| visualKey | internal icon key | No |

Exactly eight approved application labels are configured.

### Product

| Field | Type | Required | Visibility rule |
|---|---|---:|---|
| id | string | Yes | Stable |
| name | string | Yes | Approved official name/category |
| summary | string | No | Only approved copy |
| media | ApprovedAsset | No | No empty frame if absent |
| publicationStatus | PublicationStatus | Yes | approved only |
| inquiryAction | ConversionAction | Yes when approved | Resolves to an approved destination or contacto |

The seven brief categories may exist as pending candidates. The entire section is rendered only when visibleProducts.length is greater than zero.

### Benefit

| Field | Type | Required |
|---|---|---:|
| id | string | Yes |
| statement | string | Yes |
| visualKey | internal icon key | No |

Exactly seven official attributes are configured. Testimonials are not part of this model.

### CountryPresence

| Field | Type | Required |
|---|---|---:|
| code | HN, US, CO, PA, BD or GT | Yes |
| name | string | Yes |

Exactly six countries are configured. Flags, clocks and time-zone calculations are not required.

### ConversionAction

| Field | Type | Required | Rule |
|---|---|---:|---|
| id | string | Yes | Stable analytics/test identifier without adding analytics |
| label | string | Yes | Approved Spanish label |
| intent | meeting, whatsapp, services or inquiry | Yes | Defines resolution |
| destination | ApprovedDestination | No | Only approved destination |
| fallbackFragment | HomeSectionId | Conditional | Required for meeting/inquiry when destination is absent |
| approvedMessage | string | No | WhatsApp only; omit query text when absent |

Resolution rules:

- meeting with approved URL → approved URL.
- meeting without approved URL → contacto.
- whatsapp → official number; append only an approved message.
- services → servicios.
- product inquiry without a specific approved destination → contacto.

### ContactContent

| Field | Type | Required |
|---|---|---:|
| title | string | Yes |
| body | string | Yes |
| meetingAction | ConversionAction | Yes |
| whatsappAction | ConversionAction | Yes |
| email | ApprovedDestination | Yes |
| phone | ApprovedDestination | Yes |
| socialLinks | ApprovedDestination array | No |

Only LinkedIn and Instagram are candidates for the approved Home. Entries without approved URLs are absent.

### FooterContent

| Field | Type | Required |
|---|---|---:|
| brandSummary | string | Yes |
| navigation | NavigationItem array | Yes |
| services | fragment links array | Yes |
| cases | fragment links array | Yes |
| contact | ContactContent subset | Yes |
| socialLinks | ApprovedDestination array | No |
| legalLinks | ApprovedDestination array | No |
| copyrightOwner | string | Yes |

FooterComponent receives one `content: FooterContent` input. Contact information is carried only by the required nested `contact` field; no second contact input exists. The displayed year is derived at runtime. Legal links are filtered until their URLs are approved.

### HomeContent

Aggregate root:

| Field | Type | Required |
|---|---|---:|
| navigation | NavigationItem array | Yes |
| hero | HeroContent | Yes |
| clients | Client array | Yes, may be empty |
| challenges | Challenge array | Yes |
| services | Service array | Yes |
| cases | CaseStudy array | Yes |
| aiApplications | AiApplication array | Yes |
| products | Product array | Yes, may be empty |
| benefits | Benefit array | Yes |
| countries | CountryPresence array | Yes |
| contact | ContactContent | Yes |
| footer | FooterContent | Yes |

Derived selectors:

- visibleClients: approved clients with approved, resolvable logos; no textual or recreated-logo substitute.
- visibleCases: approved cases; optional media/destination filtered independently.
- visibleProducts: approved products only.
- visibleSocialLinks and visibleLegalLinks: approved, valid URLs only.
- visibleRegions: ordered regions, excluding clientes when visibleClients is empty and productos when visibleProducts is empty.

## Transient interaction state

### ActiveSectionState

Owned by the root-scoped HomeSectionObserverService:

- registeredRegionIds: the rendered HomeSectionId values plus `footer`; each id is unique and removed when its region is destroyed.
- isHomeRouteActive: route eligibility derived from the active router URL; true only for `/` and false for `/about`, `/service` and every other route.
- activeRegionId: current ObservedRegionId; defaults to inicio on Home and is empty whenever isHomeRouteActive is false.
- activeNavigationFragment: HomeSectionId destination derived from activeRegionId through the approved mapping above while isHomeRouteActive is true; empty on every non-Home route.
- activationThresholdPx: fixed at 140 for active-region arbitration.

Transitions:

- rendered region initializes/destroys → its ObservedRegionId is registered/unregistered.
- route changes from `/` to any non-Home route → activeRegionId and activeNavigationFragment clear atomically before MenuComponent can retain a stale visual state or aria-current.
- a registered region, including `footer`, reports visibility on a non-Home route → the notification does not produce an active region or fragment.
- observed region crosses the 140 px activation line on `/` → activeRegionId and activeNavigationFragment update atomically; the most recent crossing wins.
- router-fragment fallback on `/` → activeNavigationFragment uses the valid mapped destination when observation is unavailable; the fallback is disabled on non-Home routes.
- activeNavigationFragment changes → MenuComponent applies one matching visual state and `aria-current="location"`; every nonmatching link has no aria-current.

### HeaderState

Owned locally by MenuComponent except for the active fragment consumed from ActiveSectionState:

- isCompact: controlled by CSS breakpoint; not persisted.
- isMenuOpen: false by default.
- isScrolled: false until the observable scroll threshold is crossed.
- activeNavigationFragment: readonly value consumed from HomeSectionObserverService.
- lastFocusedTrigger: used only to restore focus after closing the compact menu.

Transitions:

- toggle/open → menu open, focus moves into the panel.
- Escape, close button, destination activation or desktop breakpoint → menu closed, focus returns to the trigger when appropriate.
- route away → menu closed.
- activeNavigationFragment emission → visual active class and aria-current update from the same value; no second header item remains active.

### ServiceTabsState

- activeServiceId: first service by default.
- focusableServiceId: equals active service under automatic activation.

Transitions:

- click/touch/Enter/Space → selected service becomes active.
- ArrowLeft/ArrowRight → previous/next with wrapping.
- Home/End → first/last service.

Exactly one panel is exposed at a time and its ARIA references remain valid.

### CarouselState

- currentItemId: item nearest the start/center after manual scrolling.
- canMovePrevious and canMoveNext: derived from scroll position.

Transitions:

- controls or Arrow keys → one card step in the requested direction.
- touch/pointer scroll → native position settles at a snap point.
- content list changes → state resets to the first visible item.

There is no autoplay state or timer.

### MarqueeState

Allowed values:

- running
- pausedByUser
- pausedByInteraction
- staticReducedMotion

User pause takes precedence over hover/focus changes. A reduced-motion preference forces the static state and does not remove any client.

### RevealState

Allowed values:

- visibleDefault
- pendingEnhancement
- revealed

If IntersectionObserver is unsupported, motion is reduced or setup fails, state remains visibleDefault. No transition may leave content hidden permanently.

## Validation invariants

1. All ids are unique within their entity list.
2. Navigation fragments resolve to currently rendered regions.
3. “Nosotros” resolves only to por-que-appland.
4. There is one h1 and every region has a unique visible heading.
5. Exactly five challenges, five services, five cases, eight IA applications, seven benefits and six countries are configured from the brief.
6. No pending or withdrawn item reaches the public view.
7. No informative image lacks alt text or intrinsic dimensions.
8. No absent asset or destination produces an empty control/frame.
9. Every external new-context link uses safe rel attributes.
10. All visible copy is Spanish and approved.
