import type { GridVars } from "./types"

export const grid: GridVars = {
  maxWidth: 1280,
  desktop: {
    gutter: 16,
    columns: 12,
    margin: 1280
  },
  tablet: {
    gutter: 12,
    columns: 8,
    margin: 768
  },
  phone: {
    gutter: 8,
    columns: 4,
    margin: 280
  }
}

export const tailwindCSSVars = {
  ":root": {
    // Default: Mobile
    "--grid-columns": `${grid.phone.columns}`,
    "--grid-gutter": `${grid.phone.gutter}px`,
    "--grid-margin": `${grid.phone.margin}px`,
    "--grid-max-width": `${grid.maxWidth}px`
  },
  "@media (min-width: 540px)": {
    // Tablet
    ":root": {
      "--grid-columns": `${grid.tablet.columns}`,
      "--grid-gutter": `${grid.tablet.gutter}px`,
      "--grid-margin": `${grid.tablet.margin}px`
    }
  },
  "@media (min-width: 1024px)": {
    // Desktop
    ":root": {
      "--grid-columns": `${grid.desktop.columns}`,
      "--grid-gutter": `${grid.desktop.gutter}px`,
      "--grid-margin": `${grid.desktop.margin}px`
    }
  }
}

export const base = {
  spacing: 4,
  span: "((calc(min(100dvw, var(--grid-max-width)) - (var(--grid-margin) * 2)) - (var(--grid-gutter) * (var(--grid-columns) - 1))) / var(--grid-columns))"
}
