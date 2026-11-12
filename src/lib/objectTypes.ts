export const objectTypes = ['areas', 'properties'] as const;
export type ObjectType = (typeof objectTypes)[number];
export const defaultObjectType: ObjectType = 'areas';

// Both sections use the current sample data until separate sources are available.
export const objectSources: Record<ObjectType, string> = {
  areas: '/objects.json',
  properties: '/objects.json',
};
