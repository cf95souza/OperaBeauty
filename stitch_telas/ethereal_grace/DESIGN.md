---
name: Ethereal Grace
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#504444'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#827474'
  outline-variant: '#d4c2c3'
  surface-tint: '#7c5357'
  primary: '#7c5357'
  on-primary: '#ffffff'
  primary-container: '#e8b4b8'
  on-primary-container: '#6b4448'
  inverse-primary: '#eeb9bd'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#605e5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#c4c0be'
  on-tertiary-container: '#504e4d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdadc'
  primary-fixed-dim: '#eeb9bd'
  on-primary-fixed: '#301216'
  on-primary-fixed-variant: '#623c40'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e6e1e0'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style
The brand personality is rooted in modern luxury and serene professionalism. This design system targets an upscale clientele seeking a tranquil, high-end beauty experience through a Progressive Web App (PWA). The emotional response should be one of immediate relaxation, confidence, and exclusivity.

The design style is **Minimalist with Tactile Softness**. It prioritizes heavy whitespace and a restricted color palette to convey cleanliness, while utilizing subtle shadows and soft geometry to avoid clinical coldness. The interface should feel "breathable," with every element having a clear purpose and a premium finish.

## Colors
The palette is centered on a "Soft Rose" primary tone that evokes skin health and floral elegance. 
- **Primary (Soft Rose):** Used for key actions, active states, and highlights.
- **Secondary (Deep Charcoal):** Used for high-contrast typography and grounding elements to ensure a professional, authoritative feel.
- **Tertiary (Warm Shell):** A very soft off-white used for section backgrounds to reduce eye strain and add warmth.
- **Neutral (Pure White):** Reserved for card surfaces and primary container backgrounds to maintain a crisp, clean look.

## Typography
The typographic system relies on a high-contrast pairing. **Playfair Display** provides a sophisticated, editorial serif feel for headings, reflecting the beauty industry's heritage. **Plus Jakarta Sans** offers a friendly, modern, and highly legible sans-serif experience for functional text and navigation, ensuring the PWA remains accessible on small screens. Use uppercase labels for category headers and buttons to add a sense of refined structure.

## Layout & Spacing
The layout follows a **fluid grid** model optimized for mobile-first consumption. 
- **Mobile:** 4-column grid with 20px side margins. 
- **Tablet/Desktop:** 12-column centered grid with a maximum width of 1200px.
Spacing should be generous to maintain the minimalist aesthetic. Use `xl` (40px) spacing between major sections and `md` (16px) for internal component padding. Vertical rhythm is driven by the 4px base unit, ensuring all elements align to a consistent baseline.

## Elevation & Depth
Depth is communicated through **ambient shadows** and subtle tonal layering. 
- **Level 1 (Base):** The background uses the Tertiary (Warm Shell) color.
- **Level 2 (Cards):** Pure White surfaces with a very soft, high-diffusion shadow (0px 4px 20px rgba(0,0,0,0.04)).
- **Level 3 (Overlays/Modals):** Pure White with a more pronounced shadow (0px 10px 30px rgba(0,0,0,0.08)) and a backdrop blur of 10px on the underlying content.
Avoid harsh borders; instead, let the subtle contrast between white cards and off-white backgrounds define the structure.

## Shapes
The shape language is consistently **Rounded**. This mirrors the organic nature of beauty and wellness. 
- Standard components (buttons, inputs) use a 0.5rem (8px) radius.
- Larger containers like service cards and image galleries use `rounded-xl` (1.5rem/24px) to create a soft, inviting frame. 
- Interaction elements like "Book Now" buttons may occasionally use a full pill-shape to draw attention while maintaining the soft-geometry theme.

## Components
- **Buttons:** Primary buttons are solid Soft Rose with Deep Charcoal text for legibility. Secondary buttons are Deep Charcoal with White text. Both use `label-md` typography.
- **Cards:** White backgrounds, `rounded-xl` corners, and Level 2 shadows. Use for service listings and staff profiles.
- **Inputs:** Minimalist bottom-border only or very light grey full-stroke (1px). Focus states transition the border to Soft Rose.
- **Chips:** Used for service categories (e.g., "Hair," "Nails"). Use a semi-transparent Soft Rose background with Deep Charcoal text.
- **Lists:** Service menus should have generous 24px vertical padding between items, separated by a 0.5px light grey hairline.
- **Booking Bar:** A persistent bottom navigation bar on mobile, featuring a prominent, centered "Book Appointment" button.