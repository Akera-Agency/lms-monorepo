export const getFirstSegment = (path: string, index: number) => {
  const firstSegment = path.split("/").filter(Boolean)[index];
  return firstSegment ? `/${firstSegment}` : "/";
};
