export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  return typeof secret === "string" && secret.length >= 32 ? secret : null;
};
