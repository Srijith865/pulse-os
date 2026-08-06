---
name: Monochrome Absolute
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fd'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1ec'
  on-surface: '#1a1b22'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f1effa'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1ec'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  xl: 128px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

This design system is built on a foundation of absolute clarity and editorial rigor. It utilizes a high-contrast, black-and-white aesthetic to evoke a sense of authority and timeless sophistication. By stripping away the distraction of color, the UI shifts focus entirely to content, hierarchy, and structural precision.

The style is **Minimalist-Editorial**. It leverages generous whitespace to create a sense of luxury and "breathing room," while employing razor-sharp 1px borders to define functional boundaries. The emotional response is one of calm productivity and high-end professional reliability, reminiscent of premium architectural monographs or advanced technical instruments.

## Colors

The palette is strictly achromatic. Hierarchy is established through the strategic use of value (lightness vs. darkness) rather than hue.

- **Primary (Black):** Used for primary actions, headlines, and critical UI boundaries. It represents the "ink" on the page.
- **Secondary (White):** The primary canvas color. Use white space as a functional element to group or separate content.
- **Grays:** Used for secondary text, disabled states, and subtle structural dividers.
- **Contrast:** Maintain a minimum contrast ratio of 7:1 for all body text to ensure maximum readability and an "editorial" feel.

## Typography

Typography is the primary driver of the design system's personality. We use a combination of a sharp contemporary Grotesk for impact and a systematic Sans for utility.

- **Headlines:** Set in Hanken Grotesk with tight letter-spacing for a "locked-in" look.
- **Body Text:** Set in Inter. For long-form content, prioritize line length (max 65 characters) and a generous line height to maintain the editorial feel.
- **Labels & Metadata:** Set in JetBrains Mono (monospaced) to inject a subtle "technical/tool" aesthetic. These should often be set in all caps with increased tracking.
- **Alignment:** Stick to a rigid left-aligned grid. Avoid centered text except for specific display-hero moments.

## Layout & Spacing

The layout philosophy is based on a **fixed-column grid** within a fluid container, emphasizing mathematical precision.

- **Grid:** Use a 12-column grid for desktop (max-width: 1440px) and a 4-column grid for mobile.
- **Rhythm:** All spacing must be a multiple of the 4px base unit. 
- **Whitespace:** err on the side of "too much" space. Use `lg` (64px) or `xl` (128px) vertical gaps between major sections to distinguish content blocks without needing heavy background fills.
- **Dividers:** Use 1px lines (`gray-200` or `black`) rather than colored blocks to separate layout areas.

## Elevation & Depth

This design system rejects traditional shadows in favor of **Tonal Layering** and **High-Contrast Outlines**.

- **Flat Hierarchy:** Elements exist on a flat plane. Depth is communicated by 1px solid black borders around active elements.
- **Floating Elements:** For menus or modals that must overlap content, use a solid white background with a crisp 1px black border. 
- **Subtle Offset:** Instead of a blur-based shadow, use a "hard shadow" offset by 2px or 4px (solid black) if a tactile, brutalist depth is required for buttons. Otherwise, remain entirely flat.
- **State Changes:** Use inverted colors (Background: Black, Text: White) to indicate the highest level of elevation or focus.

## Shapes

The shape language is **sharp and architectural**. 

- **Corners:** All UI elements (buttons, inputs, cards, images) utilize a 0px radius. This reinforces the "grid-based" and authoritative feel of a professional document.
- **Borders:** A consistent 1px stroke weight is used throughout. Do not scale border weight with element size; the 1px line is a constant.
- **Icons:** Use thin-stroke, geometric icons (2px stroke) that match the sharp-cornered aesthetic of the containers.

## Components

### Buttons
- **Primary:** Solid black background, white text, 0px radius. High-impact.
- **Secondary:** White background, 1px black border, black text.
- **Ghost:** No border, black text, underline on hover.

### Input Fields
- **Default:** 1px `gray-200` bottom border only (editorial style) or a full 1px border. 
- **Focus:** 1px solid black border. No "glow" or soft shadows.
- **Label:** Use the `label-caps` typography style positioned above the input.

### Cards
- **Style:** No shadow. Use a 1px `gray-200` border or simply separate via whitespace.
- **Interactive:** Border changes to 1px black on hover.

### Chips & Tags
- **Style:** 1px black border, small mono text, 0px radius. 
- **Selection:** Invert to black background when active.

### Lists
- Separate list items with a 1px `gray-100` horizontal rule. 
- Ensure generous vertical padding (at least `sm` unit) to maintain readability.