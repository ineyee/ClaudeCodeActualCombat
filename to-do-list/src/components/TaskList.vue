<script setup lang="ts">
import type { Task } from '../types'
import TaskItem from './TaskItem.vue'

defineProps<{ tasks: Task[] }>()
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  edit: [id: number, text: string]
}>()
</script>

<template>
  <div class="list">
    <template v-if="tasks.length">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
        @edit="(id, text) => emit('edit', id, text)"
      />
    </template>
    <div v-else class="empty">暂无任务</div>
  </div>
</template>
