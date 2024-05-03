import { ShapeProps } from '@react-three/drei'
import { BoxGeometry, CapsuleGeometry } from 'three'

export type TerrainElement = {
  type: 'box' | 'capsule'
  props: Omit<ShapeProps<typeof BoxGeometry> | ShapeProps<typeof CapsuleGeometry>, 'args'>
  width?: number
  height?: number
  radius?: number
  length?: number
  material?: {
    color?: string
  }
}

export const floor: TerrainElement = {
  type: 'box',
  width: 200,
  height: 200,
  props: {
    rotation: [-Math.PI / 2, 0, 0],
    receiveShadow: true
  },
  material: {
    color: '#474'
  }
}

export const terrain: TerrainElement[] = [
  floor,
  {
    type: 'box',
    props: {
      scale: [3, 3, 3],
      position: [-5, 1.5, -10],
      castShadow: true,
      receiveShadow: true
    }
  },
  {
    type: 'capsule',
    props: {
      scale: [3, 3, 3],
      position: [7.5, 1.5, 10],
      rotation: [Math.PI / 4, -Math.PI / 2, 0],
      castShadow: true,
      receiveShadow: true
    }
  },
  {
    type: 'box',
    props: {
      scale: [3, 3, 3],
      position: [-13, 1.5, -22],
      rotation: [Math.PI / 2, -Math.PI / 8, Math.PI / 4],
      castShadow: true,
      receiveShadow: true
    }
  },
  {
    type: 'capsule',
    props: {
      scale: [3, 3, 3],
      position: [-10, 1.5, 2.5],
      castShadow: true,
      receiveShadow: true
    }
  }
]
