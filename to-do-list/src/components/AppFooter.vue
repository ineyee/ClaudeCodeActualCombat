<script setup lang="ts">
defineProps<{ remaining: number; total: number }>()
const emit = defineEmits<{ clearDone: [] }>()
</script>

<template>
  <div class="footer">
    <span>{{ remaining }} 项未完成 / 共 {{ total }} 项</span>
    <button @click="emit('clearDone')">清除已完成</button>
  </div>
</template>
