import { Target } from "./target"

export interface Player {
  name: string
  position: [number, number, number]
  rotationY: number
  path: [number, number, number][]
  target: Target | null
}
