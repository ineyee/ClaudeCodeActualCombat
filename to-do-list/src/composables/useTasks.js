import { ref, computed, watch } from 'vue';
export function useTasks() {
    const tasks = ref(JSON.parse(localStorage.getItem('tasks') ?? '[]'));
    const filter = ref('all');
    const filteredTasks = computed(() => {
        if (filter.value === 'done')
            return tasks.value.filter(t => t.done);
        if (filter.value === 'active')
            return tasks.value.filter(t => !t.done);
        return tasks.value;
    });
    const remaining = computed(() => tasks.value.filter(t => !t.done).length);
    watch(tasks, () => localStorage.setItem('tasks', JSON.stringify(tasks.value)), { deep: true });
    function addTask(text, priority) {
        tasks.value.unshift({ id: Date.now(), text, done: false, priority });
    }
    function toggleTask(id) {
        const t = tasks.value.find(t => t.id === id);
        if (t)
            t.done = !t.done;
    }
    function deleteTask(id) {
        tasks.value = tasks.value.filter(t => t.id !== id);
    }
    function editTask(id, text) {
        if (!text)
            return;
        const t = tasks.value.find(t => t.id === id);
        if (t)
            t.text = text;
    }
    function setFilter(f) {
        filter.value = f;
    }
    function clearDone() {
        tasks.value = tasks.value.filter(t => !t.done);
    }
    return { tasks, filter, filteredTasks, remaining, addTask, toggleTask, deleteTask, editTask, setFilter, clearDone };
}
