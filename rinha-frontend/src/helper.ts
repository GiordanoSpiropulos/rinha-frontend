export const isArray = (value: any) => Array.isArray(value);

export const isJSPrimitive = (value: any) => {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
};
