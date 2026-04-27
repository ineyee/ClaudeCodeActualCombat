import TaskItem from './TaskItem.vue';
const __VLS_props = defineProps();
const emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "list" },
});
if (__VLS_ctx.tasks.length) {
    for (const [task] of __VLS_getVForSourceType((__VLS_ctx.tasks))) {
        /** @type {[typeof TaskItem, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(TaskItem, new TaskItem({
            ...{ 'onToggle': {} },
            ...{ 'onDelete': {} },
            ...{ 'onEdit': {} },
            key: (task.id),
            task: (task),
        }));
        const __VLS_1 = __VLS_0({
            ...{ 'onToggle': {} },
            ...{ 'onDelete': {} },
            ...{ 'onEdit': {} },
            key: (task.id),
            task: (task),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        let __VLS_3;
        let __VLS_4;
        let __VLS_5;
        const __VLS_6 = {
            onToggle: (...[$event]) => {
                if (!(__VLS_ctx.tasks.length))
                    return;
                __VLS_ctx.emit('toggle', $event);
            }
        };
        const __VLS_7 = {
            onDelete: (...[$event]) => {
                if (!(__VLS_ctx.tasks.length))
                    return;
                __VLS_ctx.emit('delete', $event);
            }
        };
        const __VLS_8 = {
            onEdit: ((id, text) => __VLS_ctx.emit('edit', id, text))
        };
        var __VLS_2;
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
}
/** @type {__VLS_StyleScopedClasses['list']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            TaskItem: TaskItem,
            emit: emit,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
