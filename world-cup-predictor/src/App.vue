<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'group' | 'knockout'>('group')
</script>

<template>
  <div id="app-root">
    <header class="app-header">
      <h1 class="app-title">⚽ 2026 World Cup Predictor</h1>
    </header>
    <nav class="tab-nav">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'group' }"
        @click="activeTab = 'group'"
      >小组赛</button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'knockout' }"
        @click="activeTab = 'knockout'"
      >淘汰赛</button>
    </nav>
    <main class="app-main">
      <p style="color:#888;text-align:center;padding:40px;">Loading...</p>
    </main>
  </div>
</template>