// Lightweight JSX declarations to allow TSX to compile without @types/react.
// This is a temporary convenience for auditing and local builds. For production
// projects prefer installing `@types/react` and `@types/react-dom`.

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
  interface ElementClass {}
  type Element = any
}

export {}
