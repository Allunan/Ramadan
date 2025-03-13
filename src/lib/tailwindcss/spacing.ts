import { base } from "./base"

/**
 * Generate Tailwind width values based on a given screen type.
 */
export const width = () => {
  const width: Record<string, string> = {}

  for (let value = 1; value <= 12; value++) {
    width[`span-w-${value}`] =
      `calc(${value} * ${base.span} + (${value} - 1) * var(--grid-gap))`
  }

  return width
}

/**
 * Generate Tailwind min-width values based on CSS variables.
 */
export const minWidth = () => {
  const minWidth: Record<string, string> = {}

  for (let value = 1; value <= 12; value++) {
    minWidth[`span-min-w-${value}`] =
      `calc(${value} * ${base.span} + (${value} - 1) * var(--grid-gap))`
  }

  return minWidth
}

/**
 * Generate Tailwind max-width values based on CSS variables.
 */
export const maxWidth = () => {
  const maxWidth: Record<string, string> = {}

  for (let value = 1; value <= 12; value++) {
    maxWidth[`span-max-w-${value}`] =
      `calc(${value} * ${base.span} + (${value} - 1) * var(--grid-gap))`
  }

  return maxWidth
}

/**
 * Generate Tailwind height values based on CSS variables.
 */
export const height = () => {
  const height: Record<string, string> = {}

  for (let value = 1; value <= 12; value++) {
    height[`span-h-${value}`] =
      `calc(${value} * ${base.span} + (${value} - 1) * var(--grid-gap))`
  }

  return height
}

/**
 * Generate Tailwind min-height values based on CSS variables.
 */
export const minHeight = () => {
  const minHeight: Record<string, string> = {}

  for (let value = 1; value <= 12; value++) {
    minHeight[`span-min-h-${value}`] =
      `calc(${value} * ${base.span} + (${value} - 1) * var(--grid-gap))`
  }

  return minHeight
}

/**
 * Generate Tailwind max-height values based on CSS variables.
 */
export const maxHeight = () => {
  const maxHeight: Record<string, string> = {}

  for (let value = 1; value <= 12; value++) {
    maxHeight[`span-max-h-${value}`] =
      `calc(${value} * ${base.span} + (${value} - 1) * var(--grid-gap))`
  }
  return maxHeight
}
/**
 * This object can then be used to extend tailwinds `gap`.
 *
 * Example of usage:
 * <div className="gap-base-1" />
 * <div className="gap-x-base-5" />
 * <div className="gap-y-base-64" />
 *
 */
export const gap = () => {
  const gap: Record<string, string> = {}

  for (let value = 1; value <= 64; value++) {
    gap[`base-${value}`] = `${base.spacing * value}px`
  }

  return gap
}

/**
 * This object can then be used to extend tailwinds `padding`.
 *
 * Example of usage:
 * <div className="p-base-5" />
 * <div className="px-base-8" />
 * <div className="pl-base-24" />
 * <div className="pe-base-56" />
 *
 */
export const padding = () => {
  const padding: Record<string, string> = {}

  for (let value = 1; value <= 64; value++) {
    padding[`base-${value}`] = `${base.spacing * value}px`
  }

  return padding
}

/**
 * This object can then be used to extend tailwinds `margin`.
 *
 * Example of usage:
 * <div className="m-base-5" />
 * <div className="mx-base-8" />
 * <div className="ml-base-24" />
 * <div className="me-base-56" />
 *
 */
export const margin = () => {
  const margin: Record<string, string> = {}

  for (let value = 1; value <= 64; value++) {
    margin[`base-${value}`] = `${base.spacing * value}px`
  }

  return margin
}
