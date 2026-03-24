# Login Screen — Figma Design Spec

Use this spec to recreate the current login screen in Figma. Artboard: **390×844** (mobile).

---

## Design tokens (variables in Figma)

| Token | Value | Usage |
|-------|--------|--------|
| **bg** | `#FDFBF8` | Page background |
| **primary** | `#1C1917` | Buttons, primary text |
| **brand** | `#C2410C` | Brand accent, focus, icons |
| **brandGradient** | Linear 135° `#92400E` → `#C2410C` | Pills, checkmark badge |
| **logoGradient** | Linear 135° `#FF6B35` → `#E65122` | “ZappyFind” logo text only |
| **textPrimary** | `#1C1917` | Headings, primary copy |
| **textMuted** | `#78716C` | Body, links (Terms/Privacy) |
| **textSecondary** | `#A8A29E` | Labels, secondary text |
| **border** | `rgba(28,25,23,0.09)` | Dividers, input default border |
| **toggleBg** | `#EDE9E3` | Segmented control track |
| **inputBg** | `#FFFFFF` | Input field background |
| **orbA** | `rgba(194,65,12,0.08)` | Top-right ambient orb |
| **orbB** | `rgba(146,64,14,0.05)` | Left + bottom-right orbs |
| **disabledBg** | `#EAE6E1` | Continue button (disabled) |
| **disabledText** | `#B8AFA6` | Continue button text (disabled) |

**Font:** Inter (all text).

---

## Layout (vertical stack, center-aligned)

- **Container:** 390×844, background = `bg`.
- **Content area:** horizontal padding **16px**, top padding **48px**, bottom **32px**, align center, text center (except where noted).

---

## 1. Ambient orbs (decorative, behind content)

- **Orb 1:** 300×300, circle, fill = radial gradient from `orbA` to transparent 70%. Position: top-right, offset **translate(35%, -35%)**.
- **Orb 2:** 200×200, circle, fill = radial gradient from `orbB` to transparent 70%. Position: top-left, offset **translate(-35%, -25%)**.
- **Orb 3:** 200×200, same as Orb 2. Position: bottom **18%**, right **-8%**.

---

## 2. Logo

- **Text:** “ZappyFind”
- **Style:** Inter, **26px**, **Bold (800)**, letter spacing **-4.5%**
- **Fill:** gradient (angle **135°**) — start `#FF6B35`, end `#E65122` (use gradient on text fill)
- **Spacing:** margin bottom **32px**

---

## 3. Hero block

- **Heading:** “Stop applying. Start getting discovered.”
  - Inter, **22–30px** (responsive; use 28px in Figma), **Bold (800)**, color `textPrimary`, line height **118%**, letter spacing **-4%**, margin bottom **12px**.
- **Body:** “ZappyFind understands you beyond your resume and connects you with recruiters and jobs that truly match your preferences.”
  - Inter, **14px**, Regular, color `textMuted`, line height **165%**, letter spacing **-1%**.
- **Block spacing:** margin bottom **32px**.

---

## 4. Segmented toggle (Sign Up / Sign In)

- **Track:** height **44px**, padding **4px**, corner radius **14px**, fill `toggleBg`.
- **Thumb (selected):** corner radius **10px**, fill white, shadow `0 1px 6px rgba(28,25,23,0.1), 0 2px 4px rgba(28,25,23,0.06)`. Width = half track minus 6px; show state “Sign Up” selected (left).
- **Labels:** “Sign Up” (left), “Sign In” (right). Inter **12px**, selected **Semibold (600)** `textPrimary`, unselected **Medium (500)** `textSecondary`, letter spacing **-1%**.
- **Spacing:** margin bottom **24px**.

---

## 5. Ticker strip

- **Height:** ~48px (py 12px + content). Full width; visually “full bleed” (extend to edges; in code width calc(100% + 32px), margin-left -16px).
- **Fade masks:** Left/right **48px** wide, linear gradient to transparent (same as bg `#FDFBF8`).
- **Pills (examples):** e.g. “Get 3x interview calls”, “AI finds the best jobs instantly”, “Become visible to top recruiters”.
  - Single pill: padding **6px 14px**, corner radius **100px**, fill `rgba(28,25,23,0.055)`, gap between icon and text **6px**.
  - Text: Inter **12px**, Medium (500), color `#57534E`, letter spacing **-1%**.
  - Icon: **9px**, color `brand` (#C2410C). Use symbols “✦” and “◈” for variety.
- **Spacing:** margin bottom **32px**.

---

## 6. Email section

- **Label:** “EMAIL ADDRESS”
  - Inter **12px**, Semibold (600), `textSecondary`, letter spacing **6%**, uppercase, align left, margin bottom **10px**.
- **Input container:**
  - Corner radius **16px**, fill `inputBg`, border **1.5px** `border`.
  - Default shadow: `0 1px 2px rgba(0,0,0,0.04)`.
  - Focus (optional variant): border `1.5px solid rgba(194,65,12,0.35)`, shadow `0 0 0 2px rgba(194,65,12,0.14), 0 2px 8px rgba(0,0,0,0.04)`.
- **Input field:** placeholder “Enter your email”. Inter **15px**, Regular, `textPrimary`, padding **17px 44px** (left 44px for envelope icon; right 44px for checkmark when valid).
- **Envelope icon:** 16×16, left inset **16px**, vertical center. Color: `textSecondary` (default) or `brand` (focused).
- **Valid-state badge (optional):** 22×22 circle, fill `brandGradient`, right **16px**, vertical center; checkmark white.
- **Spacing:** margin bottom **12px**.

---

## 7. Continue button

- **Size:** full width, height **54px** (padding 18px vertical).
- **Default (enabled):** fill `primary`, corner radius **16px**, shadow `0 4px 20px rgba(28,25,23,0.22), 0 1px 4px rgba(28,25,23,0.12)`.
- **Disabled:** fill `disabledBg`, text/icon `disabledText`, no shadow.
- **Label:** “Continue” + arrow icon (16×16). Inter **15px**, Semibold (600), white (enabled), letter spacing **-1%**, gap **8px**.
- **Spacing:** margin bottom **16px**.

---

## 8. Privacy note

- **Copy:** “By continuing, you agree to our **Terms** and **Privacy Policy**.”
  - Inter **11px**, Regular, `textSecondary`, letter spacing **1%**, line height **150%**, center aligned.
  - “Terms” and “Privacy Policy”: same size, Medium (500), `textMuted`.
- **Spacing:** margin bottom **24px** (then spacer).

---

## 9. Hiring link

- **Divider:** 1px, `border`, full width, above the link.
- **Padding top:** 20px.
- **Copy:** “Hiring? **Continue as a Company →**”
  - Inter **13px**, Medium (500) for “Hiring?”, Semibold (600) for “Continue as a Company →”. Color: “Hiring?” = `textSecondary`, link = `textPrimary`.

---

## Optional Figma variants

- **Input:** Default / Focused.
- **Continue button:** Enabled / Disabled.
- **Toggle:** Sign Up selected / Sign In selected.

---

## How to get this design into Figma

1. **Manual from this spec** — Create a 390×844 frame and build the screen using the tokens and layout above (fastest if you already use Figma).
2. **Screenshot reference** — Run the app (`npm run dev`), open the login screen, take a screenshot, and place it in Figma as reference, then trace with components and tokens.
3. **Figma REST API** — With a [Figma API token](https://www.figma.com/developers/api#access-tokens), you can script creation of nodes (frames, text, rectangles, etc.) in a Figma file; the spec above gives you exact values for each element.
4. **Code-to-Figma tools** — Services like **Anima** or **Locofy** can convert a live app or HTML export to Figma (often paid); use this spec to align naming and tokens.

If you want, the next step can be a short script (e.g. Node) that uses the Figma API to create a “Login screen” frame and basic shapes/text from this spec.
