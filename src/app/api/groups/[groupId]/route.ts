import { DrizzleRepository } from "@/data/drizzleRepository";
import { idSchema } from "@/data/validation";

const repository = new DrizzleRepository();

export async function GET(_request: Request, ctx: RouteContext<"/api/groups/[groupId]">) {
  const { groupId } = await ctx.params;
  if (!idSchema.safeParse(groupId).success) {
    return Response.json(null, { status: 404 });
  }

  const group = await repository.getGroup(groupId);
  if (!group) {
    return Response.json(null, { status: 404 });
  }

  return Response.json(group);
}
