<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import { store } from './store'
import { loadPrediction, savePrediction } from './utils/persistence'
import { createEmptyKnockout } from './utils/bracket'
import GroupStage from './components/GroupStage.vue'
import KnockoutStage from './components/KnockoutStage.vue'
import InkMask from './components/InkMask.vue'

const showConfirmReset = ref(false)

onMounted(async () => {
  store.loading = true
  store.error = null
  
  try {
    const saved = await loadPrediction()
    if (saved) {
      // Restore groups
      if (saved.groups) {
        for (const name of Object.keys(saved.groups)) {
          if (store.groups[name]) {
            store.groups[name].first = saved.groups[name].first
            store.groups[name].second = saved.groups[name].second
            store.groups[name].third = saved.groups[name].third
          }
        }
      }
      if (saved.bestThirds) store.bestThirds = saved.bestThirds
      if (saved.knockout) {
        store.knockout = saved.knockout
      }
      if (saved.champion) store.champion = saved.champion
    }
  } catch (err) {
    store.error = '加载预测数据失败，请刷新页面重试'
    console.error('Failed to load prediction:', err)
  } finally {
    store.loading = false
  }
})

// Auto-save on any store change (debounced)
watch(
  () => JSON.stringify({ groups: store.groups, bestThirds: store.bestThirds, knockout: store.knockout, champion: store.champion }),
  () => {
    savePrediction({
      groups: Object.fromEntries(
        Object.entries(store.groups).map(([k, v]) => [k, { first: v.first, second: v.second, third: v.third }])
      ),
      bestThirds: store.bestThirds,
      knockout: store.knockout,
      champion: store.champion,
    })
  }
)

function resetPrediction() {
  showConfirmReset.value = true
}

function confirmReset() {
  for (const name of Object.keys(store.groups)) {
    store.groups[name].first = null
    store.groups[name].second = null
    store.groups[name].third = null
  }
  store.bestThirds = []
  store.champion = null
  store.activeTab = 'group'
  store.knockout = createEmptyKnockout()
  showConfirmReset.value = false
}

function cancelReset() {
  showConfirmReset.value = false
}

function clearError() {
  store.error = null
}
</script>

<template>
  <div id="app-root">
    <InkMask />
    <!-- Loading State -->
    <div v-if="store.loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">加载中...</p>
    </div>

    <!-- Error Message -->
    <div v-if="store.error" class="error-banner">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ store.error }}</span>
      <button class="error-close" @click="clearError">×</button>
    </div>

    <header class="app-header">
      <h1 class="app-title">⚽ 2026 World Cup Predictor</h1>
      <div class="header-actions">
        <button class="btn-outline" @click="resetPrediction">重置预测</button>
      </div>
    </header>
    
    <nav class="tab-nav">
      <button
        class="tab-btn"
        :class="{ active: store.activeTab === 'group' }"
        @click="store.activeTab = 'group'"
      >小组赛</button>
      <button
        class="tab-btn"
        :class="{ active: store.activeTab === 'knockout' }"
        @click="store.activeTab = 'knockout'"
      >淘汰赛</button>
    </nav>
    
    <main class="app-main">
      <GroupStage v-if="store.activeTab === 'group'" />
      <KnockoutStage v-else />
    </main>

    <!-- Reset Confirmation Dialog -->
    <div v-if="showConfirmReset" class="modal-overlay" @click.self="cancelReset">
      <div class="modal-content">
        <h3 class="modal-title">确认重置</h3>
        <p class="modal-message">确定要重置所有预测吗？此操作不可撤销。</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="cancelReset">取消</button>
          <button class="btn-confirm" @click="confirmReset">确认重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-outline {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}
.btn-outline:hover {
  color: var(--text-primary);
  border-color: var(--accent);
  background: var(--accent-glow);
}

/* Loading State */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-subtle);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
}

/* Error Banner */
.error-banner {
  background: #fef2f2;
  color: #991b1b;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideDown 0.3s ease-out;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
  border: 1px solid #fecaca;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.error-icon {
  font-size: 18px;
}

.error-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.error-close {
  background: none;
  border: none;
  color: #991b1b;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.error-close:hover {
  opacity: 1;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--bg-page);
  border-radius: var(--radius-lg);
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.modal-message {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  background: var(--bg-highlight);
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-cancel:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.btn-confirm {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);
}

.btn-confirm:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.4);
}
</style>
