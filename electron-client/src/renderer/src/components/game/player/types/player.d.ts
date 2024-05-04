declare module "edenever" {
  interface Player {
    name: string
    position: [number, number, number]
    rotationY: number
    path: [number, number, number][]
    target: Target | null
  }
}
