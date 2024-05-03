import { prisma } from "@/lib";
import { validateApiRequest } from "@/lib/validate-api-request";
import { slugify } from "@/utils/slugify";

export async function GET() {
  const categories = await prisma.category.findMany();

  return Response.json({
    success: true,
    categories,
  });
}

export async function POST(request: Request) {
  try {
    const res: any = await validateApiRequest(request);

    const createResponse = await prisma.category.create({
      data: {
        name: res.name,
        description: res.description,
        image: res.image,
        slug: slugify(res.name),
      },
    });

    return Response.json({
      success: true,
      data: createResponse,
    });
  } catch (e: any) {
    return Response.json({
      success: false,
      message: e.message,
    });
  }
}
