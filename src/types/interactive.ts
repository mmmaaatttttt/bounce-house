type PointObjectType = "viewableObject" | "observer";
type MirrorObjectType = "mirror";

export interface Point {
  x: number;
  y: number;
}

export type ObjectMap = Record<string, SceneObject>;
export type ActiveMirrors = Set<string>;

export interface InteractiveSize {
  width: number;
  height: number;
}
export interface DraggableObjectProps extends Point {
  id: string;
  onDragStart?: (id: string) => void;
  isReflection?: boolean;
}

interface BaseSceneObject extends Point {
  name?: string;
  isReflection?: boolean;
}

interface PointObject extends BaseSceneObject {
  type: PointObjectType;
}

export interface MirrorProps extends BaseSceneObject {
  isVertical: boolean;
  length: number;
}

export interface MirrorObject extends MirrorProps {
  type: MirrorObjectType;
}

export type SceneObject = PointObject | MirrorObject;
