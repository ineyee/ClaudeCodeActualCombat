<script setup lang="ts">
import { useTasks } from './composables/useTasks'
import TaskInput from './components/TaskInput.vue'
import FilterBar from './components/FilterBar.vue'
import TaskList from './components/TaskList.vue'
import AppFooter from './components/AppFooter.vue'

const { filter, filteredTasks, remaining, tasks, addTask, toggleTask, deleteTask, editTask, setFilter, clearDone } = useTasks()
</script>

<template>
  <div class="app">
    <h1>待办事项</h1>
    <TaskInput @add="addTask" />
    <FilterBar :filter="filter" @change="setFilter" />
    <TaskList
      :tasks="filteredTasks"
      @toggle="toggleTask"
      @delete="deleteTask"
      @edit="editTask"
    />
    <AppFooter :remaining="remaining" :total="tasks.length" @clear-done="clearDone" />
  </div>
</template>
