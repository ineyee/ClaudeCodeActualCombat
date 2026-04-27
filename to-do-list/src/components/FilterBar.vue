<script setup lang="ts">
import type { Filter } from '../types'

const props = defineProps<{ filter: Filter }>()
const emit = defineEmits<{ change: [f: Filter] }>()

const options: { label: string; value: Filter }[] = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'active' },
  { label: '已完成', value: 'done' },
]
</script>

<template>
  <div class="filters">
    <button
      v-for="opt in options"
      :key="opt.value"
      :class="{ active: props.filter === opt.value }"
      @click="emit('change', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
