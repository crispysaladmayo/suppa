# Design System Specification: The Nurturing Canvas

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Heirloom"**

This design system rejects the clinical, sterile aesthetic of traditional health apps in favor of a "Modern Heirloom" philosophy. It is designed to feel like a beautifully curated, hand-bound journal—an object of value passed between generations of Indonesian mothers. 

To achieve this, we move beyond "template" UI by embracing **Intentional Asymmetry** and **Soft Editorial Layering**. We avoid rigid grids; instead, we use overlapping elements, generous whitespace, and organic "joy motifs" to create a sense of movement and celebration. The interface should feel like it is "breathing"—expansive, warm, and deeply supportive.

---

## 2. Colors: The Tropical Harvest
Our palette is derived from the vibrant life of Indonesian markets—the golden hue of Arumanis mangoes, the electric magenta of dragon fruit, and the deep, waxy green of banana leaves.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Content boundaries must be defined exclusively through:
1.  **Tonal Shifts:** Placing a `surface-container-low` card on a `background` base.
2.  **Negative Space:** Using the Spacing Scale to create "islands" of information.
3.  **Subtle Gradients:** Using a transition from `primary` to `primary-container` for depth.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, organic surfaces. 
- **Base Level:** `background` (#fff6e2) provides a warm, paper-like foundation.
- **Level 1 (Sections):** `surface-container-low` (#f9f0db) for broad grouping.
- **Level 2 (Active Cards):** `surface-container-lowest` (#ffffff) to provide the highest contrast and "pop" for interactive content.

### The "Glass & Gradient" Rule
To elevate the "premium" feel, use **Glassmorphism** for floating action buttons or top navigation bars. Use `surface-bright` at 80% opacity with a `20px` backdrop-blur. This allows the lush ingredient-inspired colors to bleed through, softening the interface.

---

## 3. Typography: The Nurturing Voice
The typography is a conversation between the modern Indonesian spirit and maternal warmth.

| Level | Token | Font Family | Character |
| :--- | :--- | :--- | :--- |
| **Display** | `display-lg/md` | Plus Jakarta Sans | Bold, playful, slightly oversized for "Hero" moments. |
| **Headline** | `headline-lg/md` | Plus Jakarta Sans | Professional yet rounded; used for page titles. |
| **Body** | `body-lg/md` | Be Vietnam Pro | High legibility, neutral, and clean for long-form advice. |
| **Label** | `label-md/sm` | Be Vietnam Pro | All-caps or slightly tracked out for small metadata. |

**Editorial Note:** Use `display-lg` for "Small Wins" (e.g., "Bunda, you reached your goal!") paired with a secondary color to make the text feel like a celebration.

---

## 4. Elevation & Depth
We eschew the "material" standard of heavy drop shadows for **Ambient Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card sitting on a `surface-container` background provides a natural, soft lift that mimics fine stationery.
*   **Ambient Shadows:** For floating elements (e.g., a "Add Meal" button), use a shadow with a `24px` blur, `0px` offset, and `6%` opacity. The shadow color must be a tinted version of `on-surface` (#332e22), never pure black.
*   **The Ghost Border:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. This creates a "suggestion" of a boundary without breaking the soft aesthetic.

---

## 5. Components
Our components are soft, tactile, and highly responsive to the touch.

### Cards & Containers
*   **Rule:** Forbid divider lines. Separate content using `surface` color shifts or `1.5rem (md)` vertical spacing.
*   **Radius:** Always use `lg (2rem)` or `xl (3rem)` for cards to maintain the "pillowy" feel.
*   **Motifs:** Occasionally "break the box" by having an illustrative ingredient (like a mango slice) overlap the edge of a card by `10px`.

### Buttons
*   **Primary:** High-saturation `primary` (#7b5400) with `on-primary` text. Use `full` roundness.
*   **Secondary:** `secondary-container` (#ffc2cc) with `on-secondary-container` text. This is our "Dragon Fruit" accent—use it for joyful actions like "Celebrate" or "Share."
*   **States:** On press, a subtle scale-down (0.98) is preferred over a color darken to maintain the tactile "squish" feel.

### Input Fields
*   **Style:** No bottom-line-only inputs. Use `surface-container-high` filled backgrounds with `full` rounded corners.
*   **Focus:** Indicate focus with a `2px` soft glow in `primary-fixed-dim` rather than a sharp stroke.

### Specialized App Components
*   **"Joy Sparkles":** Small SVG decorative elements using `tertiary` (#176a21) or `secondary` colors that appear when a mother logs a healthy meal.
*   **The "Bunda" Progress Ring:** A non-linear, organic-shaped progress indicator that uses a thick, soft-ended stroke.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. A card on the left can be slightly larger than its neighbor on the right to create a "scrapbook" feel.
*   **Do** use Be Vietnam Pro for all functional text to ensure accessibility for tired eyes.
*   **Do** lean into the `background` color (#fff6e2). It should feel like the primary "ink" of the app, creating a warm, non-clinical environment.

### Don't
*   **Don't** use 100% black (#000000) for anything. Always use `on-surface` (#332e22) to keep the contrast soft.
*   **Don't** use sharp corners. The `none` and `sm` roundedness tokens are strictly forbidden for containers.
*   **Don't** use standard "system" icons. Use custom, thick-stroke icons with rounded terminals that feel hand-drawn.

### Accessibility Note
While we prioritize a "warm" look, ensure all text on `primary` and `secondary` containers meets AA contrast ratios. The `on-primary-container` and `on-secondary-container` tokens have been specifically calculated for this purpose.