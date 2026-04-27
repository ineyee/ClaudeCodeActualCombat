<script setup lang="ts">
import type { Task } from '../types'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  edit: [id: number, text: string]
}>()

function onBlur(e: FocusEvent) {
  const text = (e.target as HTMLElement).textContent?.trim() ?? ''
  if (text && text !== props.task.text) {
    emit('edit', props.task.id, text)
  }
}
</script>

<template>
  <div :class="['item', `priority-${task.priority}`, { done: task.done }]">
    <input
      type="checkbox"
      :checked="task.done"
      @change="emit('toggle', task.id)"
    />
    <span
      class="item-text"
      contenteditable="true"
      :key="task.text"
      @blur="onBlur"
      @keydown.enter.prevent="($event.target as HTMLElement).blur()"
    >{{ task.text }}</span>
    <button class="btn-icon" @click="emit('delete', task.id)" title="删除">🗑</button>
  </div>
</template>
