import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { auth } from "../auth";

export const usersRoute = new OpenAPIHono();

const meResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const meRoute = createRoute({
  method: "get",
  path: "/me",
  summary: "Get current logged-in user",
  tags: ["Users"],
  responses: {
    200: {
      description: "Current user",
      content: { "application/json": { schema: meResponseSchema } },
    },
    401: { description: "Not authenticated" },
  },
});

usersRoute.openapi(meRoute, async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  return c.json(
    {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    200,
  );
});
