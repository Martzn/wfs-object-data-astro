<script setup lang="ts">
import { computed } from "vue";
import { objectSearchUrl, PAGE_SIZE } from "../lib/search";
import { useObjectSearch } from "../lib/useObjectSearch";

import { defaultLocale, translate, type Locale } from "../i18n/config";
const props = withDefaults(defineProps<{ locale?: Locale }>(), { locale: defaultLocale });
const t = computed(() => translate(props.locale));

const { criteria, objects, loading, error, ready, params, active, matches, load, reset,
  page, pageCount, pagedMatches, goToPage } = useObjectSearch(true, props.locale);
function options(key: "category" | "district") {
  return [...new Set([...objects.value.map(object => object[key]), criteria[key]])]
    .filter(Boolean).sort((a, b) => a.localeCompare(b, props.locale));
}
const categories = computed(() => options("category"));
const districts = computed(() => options("district"));
</script>

<template>
  <section class="object-search">
    <form role="search" @submit.prevent @reset.prevent="reset">
      <fieldset :disabled="!ready || loading || !!error">
        <legend>{{ t.searchTitle }}</legend>
        <div class="fields">
          <label class="query">{{ t.query }}
            <input v-model="criteria.q" type="search" name="q" :placeholder="t.queryPlaceholder" />
          </label>
          <label>{{ t.category }}
            <select v-model="criteria.category" name="category">
              <option value="">{{ t.allCategories }}</option>
              <option v-for="value in categories" :key="value" :value="value">{{ value }}</option>
            </select>
          </label>
          <label>{{ t.district }}
            <select v-model="criteria.district" name="district">
              <option value="">{{ t.allDistricts }}</option>
              <option v-for="value in districts" :key="value" :value="value">{{ value }}</option>
            </select>
          </label>
          <button type="reset">{{ t.reset }}</button>
        </div>
      </fieldset>
    </form>
    <p role="status" aria-live="polite">
      <template v-if="error">{{ error }}</template>
      <template v-else-if="loading">{{ t.loading }}</template>
      <template v-else-if="!active">{{ t.searchPrompt }}</template>
      <template v-else-if="matches.length">{{ t.resultSummary(matches.length, (page - 1) * PAGE_SIZE + 1, Math.min(page * PAGE_SIZE, matches.length)) }}</template>
      <template v-else>{{ t.noResults }}</template>
    </p>
    <button v-if="error" type="button" @click="load">{{ t.retry }}</button>
    <table v-if="active && !loading && !error" class="resultTable" :aria-label="t.results">
      <thead>
        <tr>
          <th>{{ t.name }}</th>
          <th>{{ t.address }}</th>
          <th>{{ t.category }}</th>
          <th>{{ t.district }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="object in pagedMatches" :key="object.id">
          <td><a :href="objectSearchUrl(object.id, params)">{{ object.objectName }}</a></td>
          <td>{{ object.address.street }}, {{ object.address.postalCode }} {{ object.address.city }}</td>
          <td>{{ object.category }}</td>
          <td>{{ object.district }}</td>
        </tr>
      </tbody>
    </table>
    <nav v-if="active && !loading && !error && pageCount > 1" class="pagination" :aria-label="t.resultPages">
      <a v-if="page > 1" @click="goToPage(1)">&laquo;</a>
      <a v-if="page > 1" @click="goToPage(page + 1)">&#8249;</a>
      <a v-for="number in pageCount" @click="goToPage(number)" :class="{ active: number === page }">{{ number }}</a>
      <a v-if="page < pageCount" @click="goToPage(page + 1)">&#8250;</a>
      <a v-if="page < pageCount" @click="goToPage(pageCount)">&raquo;</a>
    </nav>
  </section>
</template>

<style scoped>
.object-search { 
  background: #fff;
  padding: var(--space-default);
  color: var(--text-color); 
}
.pagination { 
  margin-top: var(--space-default);
  text-align: center;

  a {
    display: inline-block;
    margin: 0 2px;
    cursor: pointer;
    padding: 3px 4px;

    &.active {
      background: var(--primary-color);
      color: #fff;
    }
  }
}

button:disabled { opacity: 0.4; cursor: default; }
fieldset { padding: 0; margin: 0; border: 0; min-width: 0; }
.fields { display: flex; flex-wrap: wrap; gap: 1rem; align-items: end; }
label { display: grid; gap: 0.5rem; flex: 1 1 180px; min-width: 0; }
.query { flex: 2 1 260px; }
input, select, button {
  box-sizing: border-box; min-height: 44px; padding: 0.65rem;
  font: inherit; border: 1px solid #777; border-radius: 4px;
  background: white; color: inherit;
}
input, select { width: 100%; min-width: 0; }
button { cursor: pointer; border: none; background: #000; color: #fff;}
:is(input, select, button):focus-visible { outline: 3px solid var(--primary-color); outline-offset: 3px; }
.resultTable {
  width: 100%;
  border: none;
  margin: 0;
  padding: 0;
  border-collapse: collapse;
  border-spacing: 0;

  tr {
    padding: 0;
    margin: 0;
    background: #fff;
  }

  tr:nth-of-type(even) {
    background-color: var(--background-color);
  }

  th {
    text-align: left;
    padding: var(--space-default);
    background: var(--primary-color);
    color: #fff;
    font-weight: 400;
  }

  td {
    padding: 8px var(--space-default);
  }
  
  a { color: inherit; text-underline-offset: 3px; }
  a:hover {
    color: var(--primary-color);
  } 
  a:focus-visible { outline: 3px solid var(--primary-color); outline-offset: 3px; }
}
</style>
