---
name: Obsidian Horizon
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e17'
  surface-container-low: '#171c25'
  surface-container: '#1b2029'
  surface-container-high: '#262a34'
  surface-container-highest: '#31353f'
  on-surface: '#dfe2f0'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dfe2f0'
  inverse-on-surface: '#2c303b'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#b8c4ff'
  on-secondary: '#002486'
  secondary-container: '#003fd7'
  on-secondary-container: '#b8c3ff'
  tertiary: '#fcf3ff'
  on-tertiary: '#470083'
  tertiary-container: '#e8d0ff'
  on-tertiary-container: '#8031d1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c4ff'
  on-secondary-fixed: '#001354'
  on-secondary-fixed-variant: '#0036bb'
  tertiary-fixed: '#efdbff'
  tertiary-fixed-dim: '#dbb8ff'
  on-tertiary-fixed: '#2b0052'
  on-tertiary-fixed-variant: '#6600b7'
  background: '#0f131d'
  on-background: '#dfe2f0'
  surface-variant: '#31353f'
typography:
  display-xl:
    fontFamily: Sora
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Sora
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Sora
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  title-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system defines a next-generation 10-foot and multi-screen console experience inspired by modern flagship gaming interfaces. The atmosphere is cinematic, fluid, and immersive, pairing deep space midnight hues with delicate bioluminescent electric cyan accents.

The design movement combines **Ultra-Minimalism** with **Atmospheric Glassmorphism**:
- **Cinematic Submersion:** UI chrome yields to dynamic full-bleed game art and volumetric stage lighting. Interface panels float like dark obsidian glass above cinematic backdrops.
- **Micro-Luminescent Feedback:** State changes and cursor navigation do not rely on harsh borders, but rather subtle radial glows, specular highlights, and dimensional scaling.
- **Spatial Focus:** Every visual element aligns with a frictionless focal hierarchy engineered for rapid glanceability across living room viewing distances and handheld companion screens alike.

## Colors
The palette evokes an infinite midnight void illuminated by crisp energetic light sources. Dark obsidian tones serve as neutral containers, allowing titles, dynamic splash artwork, and primary focus indicators to pierce the canvas.

- **Primary (`#00F0FF` - Neon Cyan):** The primary kinetic accent. Used for focused selection rings, interactive badges, active progress trackers, and glowing focal points.
- **Secondary (`#3E66FB` - Deep Royal Blue):** Anchors visual depth, subtle radial backdrops, and active category underlines.
- **Tertiary (`#7928CA` - Plasma Violet):** Reserved for special game state indicators, trophy highlights, and premium storefront surfaces.
- **Neutral Dark Base (`#070B14` - Midnight Obsidian):** The foundational canvas color. Gradients transition fluidly between `#05080F`, `#0B1220`, and `#0E1B31`.
- **Text & Contrast Surfaces:**
  - High Emphasis: Pure White (`#FFFFFF`) with 100% opacity.
  - Medium Emphasis: Cool Ice Tint (`#8E9BAE`) at 70-85% opacity.
  - Disabled/Subtle: Slate Slate (`#4B5568`) at 40-50% opacity.

## Typography
Typography balances cinematic precision with instantaneous readability at distance.

- **Headline Display (Sora):** Applied to core titles, game banners, mode selectors, and hero callouts. The geometric yet technical letterforms inject modern gaming sophistication.
- **Body & Controls (Inter):** Applied across descriptions, activity metadata, system settings, HUD notifications, and status counters. The high x-height and neutral clarity prevent eye strain against complex backdrop renders.
- **Typographic Rules:**
  - Game headlines employ subtle white-to-translucent gradients or stark 100% white for supreme contrast.
  - Metadata lines (date, source, trophies) use `label-md` or `body-sm` rendered in cool ice slate (`#8E9BAE`) to maintain clear hierarchy over active titles.

## Layout & Spacing
The layout adheres to a widescreen 10-foot UI architecture built on an asymmetric, layered grid system.

- **Grid Architecture:** 12-column dynamic fluid layout with wide outer margins (`3.5rem` on TV/desktop display) ensuring safe zones from screen bezels.
- **Horizontal Shelf Model:**
  - **Top Anchor (Status & Root Navigation):** Fixed height (72px), hosting primary categories (e.g., Games, Media), global search, settings, and profile state.
  - **Upper Shelf (App & Game Icon Ribbon):** Compact quick-switcher row with high-density horizontal scrolling.
  - **Center Canvas (Hero Stage):** Full-bleed immersive promotional artwork with left-aligned typographic details and metadata.
  - **Lower Shelf (Interactive Context Cards):** Horizontally scrolling carousel of activity cards, news tiles, and progress modules (`space-lg` gaps).
- **Responsive Adaptations:**
  - **Desktop / TV Console:** Expansive margins, large hero stages, and horizontal card carousels.
  - **Handheld / Mobile:** Converts horizontal card carousels to snap-to-scroll swipe lists, scales outer margins to `1.25rem`, and switches top-level global icons to bottom glass tabs.

## Elevation & Depth
Depth is constructed through optical transmission rather than opaque drop shadows.

- **Surface Glassmorphism:**
  - Base Floating Cards: Dark obsidian fill `rgba(13, 20, 36, 0.55)` paired with `backdrop-filter: blur(24px)` and a subtle interior border `inset 0 1px 0 rgba(255, 255, 255, 0.12)`.
  - Focused / Active State: The active element scales up (`1.05x`), gains a specular border `rgba(0, 240, 255, 0.7)` and radiates a dual-stage glow: an outer soft cyan bloom (`0 12px 36px rgba(0, 240, 255, 0.25)`) and an ambient core drop (`0 20px 48px rgba(0, 0, 0, 0.8)`).
- **Z-Index Layering Hierarchy:**
  1. *Layer 0 (Canvas Backdrop):* Volumetric background video or key art with dark bottom-vignette.
  2. *Layer 1 (Card Matrix & Carousel):* Frosted obsidian media containers.
  3. *Layer 2 (Header & Nav Indicators):* Crisp navigation anchored at the screen ceiling.
  4. *Layer 3 (Modals, Overlays, and Focus Enclosure):* High-intensity glowing cards, control tooltips, and interactive drawers.

## Shapes
The visual identity relies on smooth, sculpted curvature that echoes futuristic hardware hardware chassis.

- **Cards & Tiles (`roundedness: 2` / 16px):** Game preview tiles, settings modules, and activity blocks use softened squircle radii to balance technical precision with approachable modernity.
- **Top Ribbon Game App Icons (18px - 22px):** Subtle pill-squared icons with smooth continuous curvatures.
- **Pill Badges & Buttons (Full / 9999px):** System status pills, action buttons, category switches, and user avatar rings use rounded organic contours to contrast with geometric display typography.

## Components

### 1. Navigation Ribbon & App Tiles
- **Structure:** Square-proportioned icon tiles (`80x80px` standard, expanding to `96x96px` upon focus).
- **Default State:** Translucent obsidian surface `rgba(255, 255, 255, 0.05)`, crisp monochromatic or brand icon inside, 50% opacity.
- **Active / Focused State:** Scale `1.1x`, pure white foreground, cyan outline glow (`1.5px solid rgba(0, 240, 255, 0.9)`), with the active title rendered directly beneath the tile in `title-sm` with a glowing indicator pip.

### 2. Action Buttons & Micro-Pills
- **Primary Action (Play / Resume):** Filled pure white pill with deep black typography (`#05080F`), scaling slightly on hover/focus with a soft cyan edge wash.
- **Secondary Action (Options / Download):** Glassmorphic pill with `rgba(255, 255, 255, 0.08)` background, 1px white border at 15% opacity, and white text.
- **Status Pills:** Compact capsules displaying playtime, trophy progress, or network ping using `label-sm` with a leading 6px glowing indicator dot.

### 3. Interactive Context & Activity Cards
- **Structure:** 16:9 or 21:9 aspect ratio preview containers with dark frosted backing.
- **Media Content:** High-resolution video trailer preview or key art.
- **Footer Overlay:** Dark-to-transparent vertical gradient housing a circular play icon (`32x32px`), progress bar, and card title in `title-md`.
- **Focus Transition:** 250ms cubic-bezier ease-out scale; border light increases from zero to `rgba(0, 240, 255, 0.6)`.

### 4. Top Status Header
- **Layout:** Left root category switcher (e.g., "Games", "Media") in `headline-sm` with 40% opacity for inactive items and 100% white with an active cyan dot for the selected tab.
- **Right Utilities:** Global search icon, system settings gear, circular profile avatar with online status badge, and an ultra-crisp digital clock in `title-md`.

### 5. Input Fields & Search Bars
- **Surface:** Deep charcoal slate `rgba(15, 23, 42, 0.7)` with full-blur glass backdrop.
- **States:** Inactive border `rgba(255, 255, 255, 0.1)`, focusing shifts border to `#00F0FF` with a subtle inner blue halo.
- **Text:** Placeholder in `body-md` cool ice slate, typed text in pure white.