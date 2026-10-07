import { DrizzleRepository } from "@/data/drizzleRepository";
import { idSchema } from "@/data/validation";

const repository = new DrizzleRepository();

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/groups/[groupId]/expenses">
) {
  const { groupId } = await ctx.params;
  if (!idSchema.safeParse(groupId).success) {
    return Response.json([]);
  }

  return Response.json(await repository.listExpenses(groupId));
}
