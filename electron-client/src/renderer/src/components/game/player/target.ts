export interface Target {
  position: [number, number, number]
  id: number
  type: 'chest' // | 'user';
  health: number
}
