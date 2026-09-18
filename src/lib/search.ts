export interface SearchObject {
  id: string;
  objectName: string;
  description: string;
  category: string;
  district: string;
  address: { street: string; postalCode: string; city: string };
  url: string;
}

/** Only carry search criteria, never arbitrary URL parameters. */
export function searchParams(params: URLSearchParams): URLSearchParams {
  const result = new URLSearchParams();
  for (const key of ["q", "category", "district"]) {
    const value = params.get(key);
    if (value?.trim()) result.set(key, value);
  }
  return result;
}

export function objectSearchUrl(id: string, params: URLSearchParams): string {
  const context = searchParams(params);
  const page = parsePage(params.get("page"));
  if (context.size && page > 1) context.set("page", String(page));
  return `/objects/${encodeURIComponent(id)}/${context.size ? `?${context}` : ""}`;
}

export const PAGE_SIZE = 10;

export function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase("de").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss");
}

export function objectSearchText(object: Omit<SearchObject, "url">): string {
  return normalizeSearch([
      object.id, object.objectName, object.description, object.category,
      object.district, object.address.street, object.address.postalCode, object.address.city,
  ].join(" "));
}

export function matchesSearch(text: string, category: string, district: string, params: URLSearchParams): boolean {
  const query = params.get("q")?.trim() ?? "";
  const selectedCategory = params.get("category") ?? "";
  const selectedDistrict = params.get("district") ?? "";
  if (!query && !selectedCategory && !selectedDistrict) return false;
  if (selectedCategory && category !== selectedCategory) return false;
  if (selectedDistrict && district !== selectedDistrict) return false;
  return normalizeSearch(query).split(/\s+/).filter(Boolean).every((term) => text.includes(term));
}

export function filterObjects(objects: SearchObject[], query: string, category: string, district: string) {
  const params = new URLSearchParams({ q: query, category, district });
  return objects.filter((object) => matchesSearch(objectSearchText(object), object.category, object.district, params));
}
