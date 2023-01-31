export function parseObjectPascalToCamel(object: { [k: string]: any }): {
  [k: string]: any;
} {
  const newObject: any = {};

  const keys = Object.keys(object);
  for (let key of keys) {
    const value = object.hasOwnProperty(key) ? object[key] : undefined;
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);
    newObject[newKey] = value;
  }

  return newObject;
}
