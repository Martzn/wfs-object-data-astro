<script setup lang="ts">
import { computed } from "vue";
import { objectSearchUrl } from "../lib/search";
import { useObjectSearch } from "../lib/useObjectSearch";
import { defaultLocale, translate, type Locale } from "../i18n/config";
const props = withDefaults(defineProps<{ objectId: string; locale?: Locale }>(), { locale: defaultLocale });
const t = computed(() => translate(props.locale));
const { matches, params, active, backUrl, loading, error, load } = useObjectSearch(false, props.locale);
const index = computed(() => matches.value.findIndex(object => object.id === props.objectId));
const previous = computed(() => index.value > 0 ? matches.value[index.value - 1] : undefined);
const next = computed(() => index.value >= 0 ? matches.value[index.value + 1] : undefined);
</script>

<template>
  <nav class="search-navigation" :aria-label="t.searchNavigation">
    <template v-if="active">
      <button v-if="error" type="button" @click="load">{{ t.retry }}</button>
      <div v-else-if="!loading" class="neighbors">
        <a v-if="previous" :href="objectSearchUrl(previous.id, params)" :title="previous.objectName">←</a>
        {{ index + 1 }} / {{ matches.length }}
        <a v-if="next" :href="objectSearchUrl(next.id, params)" :title="next.objectName">→</a>
      </div>
    </template>
  </nav>
  <div class="content">
    <a :href="backUrl" class="back-button">{{ t.backToSearch }}</a>
  </div>
</template>

<style scoped>
a { text-decoration: none; }
a:focus-visible, button:focus-visible { outline: 3px solid var(--primary-color); outline-offset: 3px; }
button { padding: 0.65rem; font: inherit; cursor: pointer; }

nav {
  background: var(--primary-color);
  color: #fff;
  padding: 0 var(--space-default) var(--space-default) var(--space-default);
  text-align: right;

  a {
    color: #fff;
  }
}

.content {
  background: var(--background-color);
  padding: var(--space-default);
}

.back-button {
  background: var(--primary-color);
  color: #fff;
  display: inline-block;
  margin-bottom: 0;
  font-weight: normal;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 6px 12px;
  font-size: 13px;
  line-height: 1.42857143;
  border-radius: 0;
}
</style>
