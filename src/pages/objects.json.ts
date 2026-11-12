import { objectPath } from "../i18n/paths";
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
    url: objectPath(object.id),
  }));

  return new Response(JSON.stringify(searchData), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};