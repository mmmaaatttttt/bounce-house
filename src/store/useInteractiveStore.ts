import { create } from "zustand";

import { SceneObject, InteractiveSize, Point } from "../types/interactive";

const GRID_WIDTH = 900;
const GRID_HEIGHT = 600;
const CELL_SIZE = 30;

interface InteractiveStoreState {
  interactiveSize: InteractiveSize;
  gridSize: number;
  gridVisible: boolean;
  objects: Record<string, SceneObject>;
  selectedObject: string | null;
  dragging: boolean;
  showReflections: boolean;
  activeMirrors: Set<string>;
  currentReflection: Point | null;

  setInteractiveSize: (size: InteractiveSize) => void;
  showGrid: () => void;
  hideGrid: () => void;
  startDragging: (objectId: string) => void;
  stopDragging: () => void;
  moveObject: (objectId: string, position: { x: number; y: number }) => void;
  resetPosition: (objectId: string) => void;

  toggleReflections: () => void;
  toggleMirror: (mirrorId: string) => void;
  setCurrentReflection: (reflectionLoc: Point) => void;
}

const initialObjects: Record<string, SceneObject> = {
  obj1: {
    x: GRID_WIDTH / 2,
    y: (2 * GRID_HEIGHT) / 3 - 70,
    type: "viewableObject",
    isReflection: false,
  },
  observer: {
    x: GRID_WIDTH / 2,
    y: (2 * GRID_HEIGHT) / 3 + 20,
    type: "observer",
    isReflection: false,
  },
  mirror1: {
    x: (2 * GRID_WIDTH) / 3 - 2 * CELL_SIZE,
    y: (2 * GRID_HEIGHT) / 3 - CELL_SIZE - 10,
    type: "mirror",
    name: "Right Mirror",
    isVertical: true,
    length: 6 * CELL_SIZE,
    isReflection: false,
  },
  mirror2: {
    x: GRID_WIDTH / 3 + 2 * CELL_SIZE,
    y: (2 * GRID_HEIGHT) / 3 - CELL_SIZE - 10,
    type: "mirror",
    name: "Left Mirror",
    isVertical: true,
    length: 6 * CELL_SIZE,
    isReflection: false,
  },
  mirror3: {
    x: GRID_WIDTH / 2,
    y: (2 * GRID_HEIGHT) / 3 - 4 * CELL_SIZE - 10,
    type: "mirror",
    name: "Top Mirror",
    isVertical: false,
    length: 6 * CELL_SIZE,
    isReflection: false,
  },
};

const useInteractiveStore = create<InteractiveStoreState>(set => ({
  interactiveSize: { width: GRID_WIDTH, height: GRID_HEIGHT },
  gridSize: CELL_SIZE,
  gridVisible: false,

  objects: initialObjects,
  selectedObject: null,
  dragging: false,
  isAnimating: false,
  showReflections: false,
  activeMirrors: new Set(["mirror1"]),
  currentReflection: null,

  setInteractiveSize: size => set({ interactiveSize: size }),

  showGrid: () => set({ gridVisible: true }),

  hideGrid: () =>
    set(() => ({
      gridVisible: false,
      selectedObject: null,
      dragging: false,
    })),

  startDragging: objectId =>
    set(() => ({
      selectedObject: objectId,
      dragging: true,
      gridVisible: true,
      currentReflection: null,
    })),

  stopDragging: () =>
    set(() => ({
      dragging: false,
      selectedObject: null,
    })),

  moveObject: (objectId, position) =>
    set(state => ({
      objects: {
        ...state.objects,
        [objectId]: {
          ...state.objects[objectId],
          ...position,
        },
      },
    })),

  resetPosition: objectId =>
    set(state => ({
      objects: {
        ...state.objects,
        [objectId]: {
          ...state.objects[objectId],
          x: initialObjects[objectId].x,
          y: initialObjects[objectId].y,
        },
      },
    })),

  toggleReflections: () =>
    set(st => ({ showReflections: !st.showReflections })),
  toggleMirror: mirrorId =>
    set(st => {
      const activeMirrors = new Set(st.activeMirrors);
      if (activeMirrors.has(mirrorId)) {
        activeMirrors.delete(mirrorId);
      } else {
        activeMirrors.add(mirrorId);
      }
      return { activeMirrors, currentReflection: null };
    }),

  setCurrentReflection: (reflectionLoc: Point) =>
    set(st => {
      if (st.currentReflection) {
        const { x, y } = st.currentReflection;
        if (reflectionLoc.x === x && reflectionLoc.y === y) {
          return { currentReflection: null };
        }
      }
      return { currentReflection: reflectionLoc };
    }),
}));

export default useInteractiveStore;
