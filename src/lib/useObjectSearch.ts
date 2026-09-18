import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { filterObjects, searchParams, parsePage, PAGE_SIZE, type SearchObject } from "./search";

/** Shared search state for the search form and detail navigation. */
export function useObjectSearch(syncUrl = false) {
  const criteria = reactive({ q: "", category: "", district: "" });
  const objects = ref<SearchObject[]>([]);
  const loading = ref(false);
  const error = ref("");
  const ready = ref(false);
  const requestedPage = ref(1);
  const loaded = ref(false);
  let restoring = false;
  const controller = new AbortController();
  const active = computed(() => searchParams(new URLSearchParams(criteria)).size > 0);
  const matches = computed(() => filterObjects(objects.value, criteria.q, criteria.category, criteria.district));
  const pageCount = computed(() => Math.max(1, Math.ceil(matches.value.length / PAGE_SIZE)));
  const page = computed(() => !active.value ? 1 : loaded.value
    ? Math.min(requestedPage.value, pageCount.value) : requestedPage.value);
  const pagedMatches = computed(() => matches.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE));
  const params = computed(() => {
    const result = searchParams(new URLSearchParams(criteria));
    if (result.size && page.value > 1) result.set("page", String(page.value));
    return result;
  });
  const backUrl = computed(() => params.value.size ? `/?${params.value}` : "/");

  function restore() {
    restoring = true;
    const url = new URL(location.href);
    for (const key of ["q", "category", "district"] as const) {
      criteria[key] = url.searchParams.get(key) ?? "";
    }
    requestedPage.value = parsePage(url.searchParams.get("page"));
    restoring = false;
  }

  async function load() {
    loading.value = true;
    error.value = "";
    try {
      const response = await fetch("/objects.json", { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      objects.value = await response.json();
      loaded.value = true;
    } catch {
      if (!controller.signal.aborted) error.value = "Die Objekte konnten nicht geladen werden. Bitte versuche es erneut.";
    } finally {
      loading.value = false;
    }
  }

  watch(criteria, () => {
    if (!restoring) requestedPage.value = 1;
  }, { flush: "sync" });

  watch(params, () => {
    if (!syncUrl || !ready.value) return;
    const url = new URL(location.href);
    for (const key of ["q", "category", "district", "page"]) {
      const value = params.value.get(key);
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    url.searchParams.delete("fromSearch");
    history.replaceState(history.state, "", url);
  });

  onMounted(() => {
    restore();
    ready.value = true;
    window.addEventListener("popstate", restore);
    if (syncUrl || active.value) void load();
  });
  onUnmounted(() => {
    controller.abort();
    window.removeEventListener("popstate", restore);
  });

  function reset() {
    Object.assign(criteria, { q: "", category: "", district: "" });
    requestedPage.value = 1;
  }
  function goToPage(value: number) {
    requestedPage.value = Math.max(1, Math.min(value, pageCount.value));
  }
  return { criteria, objects, loading, error, ready, params, active, matches, backUrl, load, reset,
    page, pageCount, pagedMatches, goToPage };
}
