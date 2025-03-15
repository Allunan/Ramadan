/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// Add declaration for GLSL files
declare module "*.glsl" {
  const content: string
  export default content
}

declare module "*.vert" {
  const content: string
  export default content
}

declare module "*.frag" {
  const content: string
  export default content
}
