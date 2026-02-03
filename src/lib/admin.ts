export const getAdminCode = () => process.env.ADMIN_CODE ?? "lion2026";

export const isAdminRequest = (request: Request) => {
  const headerCode = request.headers.get("x-admin-code");
  const queryCode = new URL(request.url).searchParams.get("code");
  const code = headerCode || queryCode || "";
  return code === getAdminCode();
};
