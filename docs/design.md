# Sakai NG Frontend Design Guidelines & Token System

This document outlines the visual identity rules, color tokens, typography scales, spacing structures, and animations for the frontend layout.

---

## 1. Color Palette & Variable Systems

The portal supports dynamic Light and Dark modes. Color values are defined as CSS custom variables in HSL format inside `src/app/erp/theme/`:

| Color Key | Light Mode Value | Dark Mode Value | Usage Context |
| :--- | :--- | :--- | :--- |
| `--primary` | `217, 91%, 60%` (`#4A90E2`) | `217, 91%, 60%` (`#4A90E2`) | Buttons, active icons, brand accent |
| `--background` | `210, 40%, 98%` (`#F8FAFC`) | `222, 47%, 11%` (`#0F172A`) | App root background |
| `--surface-card`| `0, 0%, 100%` (`#FFFFFF`) | `217, 33%, 17%` (`#1E293B`) | Workspace panels, widgets |
| `--text-main` | `222, 47%, 11%` (`#0F172A`) | `210, 40%, 98%` (`#F8FAFC`) | Headings, base text labels |
| `--text-muted` | `215, 16%, 47%` (`#64748B`) | `215, 20%, 65%` (`#94A3B8`) | Subtitles, disabled tabs |
| `--border` | `214, 32%, 91%` (`#E2E8F0`) | `217, 19%, 27%` (`#334155`) | Input outlines, card frames |

---

## 2. Typography & Fonts

### 2.1 Font Family
* **Primary Font:** `'Outfit', sans-serif` (Imported from Google Fonts).
* **Fallback Font:** `system-ui, -apple-system, sans-serif`.

### 2.2 Scale Mappings
* **H1 (Page Title):**
  * Size: `2.25rem` (`36px`)
  * Weight: `600` (Semi-Bold)
  * Line-height: `1.2`
  * Letter-spacing: `-0.02em`
* **H2 (Card Headers):**
  * Size: `1.5rem` (`24px`)
  * Weight: `500` (Medium)
  * Line-height: `1.3`
* **H3 (Sub-sections):**
  * Size: `1.25rem` (`20px`)
  * Weight: `400` (Regular)
* **Body text (Paragraphs):**
  * Size: `1rem` (`16px`)
  * Line-height: `1.5`
* **Caption / Label:**
  * Size: `0.875rem` (`14px`)
  * Weight: `500`

---

## 3. Responsive Layout & Spacing Rules

We use a responsive mobile-first grid system using Tailwind CSS and PrimeFlex:

### 3.1 Breakpoint Scale
* **Mobile (xs/sm):** `320px` to `640px` (Sidebar hidden, burger menu active).
* **Tablet (md):** `641px` to `1024px` (Sidebar collapsed to icons).
* **Desktop (lg/xl):** `1025px` and up (Sidebar expanded).

### 3.2 Spacing Mappings
* **Page Padding:** Page containers use `p-6` (`1.5rem`) on desktop and `p-4` on mobile devices.
* **Component Margins:** Layout panels are separated by a consistent `mb-6` (`1.5rem`) margin.
* **Form Grid Gap:** Form inputs must be arranged in a grid with a `gap-4` (`1rem`) offset.

---

## 4. Micro-Animations & Transitions

We use subtle transitions on hover and active states to make the dashboard feel interactive and alive:

### 4.1 Transition Rules
* **Hover transition:** Hover transitions on interactive components (buttons, links, select menus) must use a smooth transition:
  `transition-all duration-300 ease-in-out`
* **Card Lift animation:** Apply subtle lift hover states on dashboard cards:
  `hover:translate-y-[-4px] hover:shadow-lg`
* **Form focus outline:** Form fields must show a smooth focus outline when selected:
  `focus:border-primary focus:ring-2 focus:ring-primary/20`
