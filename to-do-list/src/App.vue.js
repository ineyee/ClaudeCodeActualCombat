import { useTasks } from './composables/useTasks';
import TaskInput from './components/TaskInput.vue';
import FilterBar from './components/FilterBar.vue';
import TaskList from './components/TaskList.vue';
import AppFooter from './components/AppFooter.vue';
const { filter, filteredTasks, remaining, tasks, addTask, toggleTask, deleteTask, editTask, setFilter, clearDone } = useTasks();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
/** @type {[typeof TaskInput, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(TaskInput, new TaskInput({
    ...{ 'onAdd': {} },
}));
const __VLS_1 = __VLS_0({
    ...{ 'onAdd': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onAdd: (__VLS_ctx.addTask)
};
var __VLS_2;
/** @type {[typeof FilterBar, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(FilterBar, new FilterBar({
    ...{ 'onChange': {} },
    filter: (__VLS_ctx.filter),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onChange': {} },
    filter: (__VLS_ctx.filter),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_10;
let __VLS_11;
let __VLS_12;
const __VLS_13 = {
    onChange: (__VLS_ctx.setFilter)
};
var __VLS_9;
/** @type {[typeof TaskList, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(TaskList, new TaskList({
    ...{ 'onToggle': {} },
    ...{ 'onDelete': {} },
    ...{ 'onEdit': {} },
    tasks: (__VLS_ctx.filteredTasks),
}));
const __VLS_15 = __VLS_14({
    ...{ 'onToggle': {} },
    ...{ 'onDelete': {} },
    ...{ 'onEdit': {} },
    tasks: (__VLS_ctx.filteredTasks),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_17;
let __VLS_18;
let __VLS_19;
const __VLS_20 = {
    onToggle: (__VLS_ctx.toggleTask)
};
const __VLS_21 = {
    onDelete: (__VLS_ctx.deleteTask)
};
const __VLS_22 = {
    onEdit: (__VLS_ctx.editTask)
};
var __VLS_16;
/** @type {[typeof AppFooter, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(AppFooter, new AppFooter({
    ...{ 'onClearDone': {} },
    remaining: (__VLS_ctx.remaining),
    total: (__VLS_ctx.tasks.length),
}));
const __VLS_24 = __VLS_23({
    ...{ 'onClearDone': {} },
    remaining: (__VLS_ctx.remaining),
    total: (__VLS_ctx.tasks.length),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_26;
let __VLS_27;
let __VLS_28;
const __VLS_29 = {
    onClearDone: (__VLS_ctx.clearDone)
};
var __VLS_25;
/** @type {__VLS_StyleScopedClasses['app']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TaskInput: TaskInput,
            FilterBar: FilterBar,
            TaskList: TaskList,
            AppFooter: AppFooter,
            filter: filter,
            filteredTasks: filteredTasks,
            remaining: remaining,
            tasks: tasks,
            addTask: addTask,
            toggleTask: toggleTask,
            deleteTask: deleteTask,
            editTask: editTask,
            setFilter: setFilter,
            clearDone: clearDone,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
