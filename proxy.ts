export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/posts/create", "/posts/:id*/edit", "/dashboard"],
};
