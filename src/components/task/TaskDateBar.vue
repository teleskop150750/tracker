<template>
    <div class="task-date-bar">
        <VTextField class="modal-content-mew-task__name" :model-value="start" @update:modelValue="setStart($event)" type="date" label="Дата начала" />
        <VTextField
            class="modal-content-mew-task__name"
            :model-value="end"
            @update:modelValue="setEnd($event)"
            :min="start"
            type="date"
            label="Срок выполнения"
        />
    </div>
</template>

<script>
import dayjs from 'dayjs'
import VTextField from '../base/VTextField/VTextField'
export default {
    components: {
        VTextField,
    },
    data() {
        return {
            start: dayjs().format('YYYY-MM-DD'),
            end: dayjs().format('YYYY-MM-DD'),
        }
    },
    methods: {
        setStart(value) {
            const start = dayjs(value)
            const end = dayjs(this.end)

            if (end.diff(start, 'days') < 0) {
                this.end = value
            }

            this.start = value
        },
        setEnd(value) {
            const start = dayjs(this.start)
            const end = dayjs(value)
            this.end = end.diff(start, 'days') < 0 ? this.start : value
        },
    },
}
</script>

<style>
.task-date-bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;

    padding: 0.5rem 0;
}
</style>
