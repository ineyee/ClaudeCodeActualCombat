<script setup lang="ts">
import { ref } from 'vue'
import type { Priority } from '../types'

const emit = defineEmits<{ add: [text: string, priority: Priority] }>()

const newText = ref('')
const priority = ref<Priority>('medium')

function submit() {
  const text = newText.value.trim()
  if (!text) return
  emit('add', text, priority.value)
  newText.value = ''
}
</script>

<template>
  <div class="input-row">
    <input
      v-model="newText"
      type="text"
      placeholder="添加新任务…"
      maxlength="200"
      @keydown.enter="submit"
    />
    <select v-model="priority" class="priority-select">
      <option value="high">高</option>
      <option value="medium">中</option>
      <option value="low">低</option>
    </select>
    <button @click="submit">添加</button>
  </div>
</template>
