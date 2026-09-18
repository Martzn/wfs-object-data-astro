import type { APIRoute } from "astro";
import { getObjects } from "../lib/objects";

export const prerender = true;

export const GET: APIRoute = async () => {
  const objects = await getObjects();

  const searchData = objects.map((object) => ({
    id: object.id,
    objectName: object.objectName,
    description: object.description,
    category: object.category,
    address: object.address,
    district: object.district,
    url: `/objects/${encodeURIComponent(object.id)}/`,
  }));

  return new Response(JSON.stringify(searchData), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};