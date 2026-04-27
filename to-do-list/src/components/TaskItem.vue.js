const props = defineProps();
const emit = defineEmits();
function onBlur(e) {
    const text = e.target.textContent?.trim() ?? '';
    if (text && text !== props.task.text) {
        emit('edit', props.task.id, text);
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: (['item', `priority-${__VLS_ctx.task.priority}`, { done: __VLS_ctx.task.done }]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onChange: (...[$event]) => {
            __VLS_ctx.emit('toggle', __VLS_ctx.task.id);
        } },
    type: "checkbox",
    checked: (__VLS_ctx.task.done),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ onBlur: (__VLS_ctx.onBlur) },
    ...{ onKeydown: (...[$event]) => {
            $event.target.blur();
        } },
    ...{ class: "item-text" },
    contenteditable: "true",
    key: (__VLS_ctx.task.text),
});
(__VLS_ctx.task.text);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.emit('delete', __VLS_ctx.task.id);
        } },
    ...{ class: "btn-icon" },
    title: "删除",
});
/** @type {__VLS_StyleScopedClasses['item-text']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emit: emit,
            onBlur: onBlur,
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
