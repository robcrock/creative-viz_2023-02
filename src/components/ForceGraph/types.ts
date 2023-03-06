export type NodeType = {
  name: string;
  group: number;
  level: string;
  radiusSize: number;
  fillColor: string;
  x: number;
  y: number;
};
export type LinkType = {
  source: string;
  target: string;
  value: string;
};
export type DataObjectType = {
  nodes: NodeType[];
  links: LinkType[];
};
export type PointType = {
  x: number;
  y: number;
};
export type DatumType = {
  x: number;
  y: number;
  fx: number | null;
  fy: number | null;
};
