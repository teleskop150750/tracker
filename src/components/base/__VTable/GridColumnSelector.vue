<template>
    <div class="grid-column-selector">
        <div class="grid-column-selector__row">
            <div v-for="(value, key) in map" :key="key">
                <GridColumnSelectorGroup :group="value" @select-item="onSelectItem" @select-group="onSelectGroup" />
            </div>
        </div>
    </div>
</template>

<script>
import GridColumnSelectorGroup from './GridColumnSelectorGroup'

export default {
    components: {
        GridColumnSelectorGroup,
    },
    data() {
        return {
            items: [
                {
                    id: 1,
                    label: 'Важность',
                    value: true,
                    group_id: 1,
                },
                {
                    id: 2,
                    label: 'Управление',
                    value: true,
                    group_id: 1,
                },
                {
                    id: 3,
                    label: 'Статус',
                    value: true,
                    group_id: 1,
                },
                {
                    id: 4,
                    label: 'Группа статусов',
                    value: true,
                    group_id: 1,
                },
                {
                    id: 5,
                    label: 'Дата создания',
                    value: true,
                    group_id: 2,
                },
                {
                    id: 6,
                    label: 'Дата начала',
                    value: false,
                    group_id: 2,
                },
                {
                    id: 7,
                    label: 'Срок выполнения',
                    value: false,
                    group_id: 2,
                },
                {
                    id: 8,
                    label: 'Дата выполнения',
                    value: false,
                    group_id: 2,
                },
                {
                    id: 9,
                    label: 'Длительность',
                    value: false,
                    group_id: 2,
                },
                {
                    id: 10,
                    label: 'Автор',
                    value: false,
                    group_id: 3,
                },
                {
                    id: 11,
                    label: 'ID',
                    value: false,
                    group_id: 3,
                },
                {
                    id: 12,
                    label: 'Тип объекта',
                    value: false,
                    group_id: 3,
                },
            ],
            groups: [
                {
                    id: 1,
                    label: 'Управление',
                },
                {
                    id: 2,
                    label: 'График',
                },
                {
                    id: 3,
                    label: 'График',
                },
            ],
            items2: [
                {
                    id: 1,
                    header: {
                        id: 1,
                        label: 'Управление',
                        value: true,
                    },
                    items: [
                        {
                            id: '1-1',
                            label: 'Важность',
                            value: true,
                        },
                        {
                            id: '1-2',
                            label: 'Управление',
                            value: true,
                        },
                        {
                            id: '1-3',
                            label: 'Статус',
                            value: true,
                        },
                        {
                            id: '1-4',
                            label: 'Группа статусов',
                            value: true,
                        },
                    ],
                },
                {
                    id: 2,
                    header: {
                        id: 2,
                        label: 'График',
                        value: false,
                    },
                    items: [
                        {
                            id: '2-1',
                            label: 'Дата создания',
                            value: true,
                        },
                        {
                            id: '2-2',
                            label: 'Дата начала',
                            value: false,
                        },
                        {
                            id: '2-3',
                            label: 'Срок выполнения',
                            value: false,
                        },
                        {
                            id: '2-4',
                            label: 'Дата выполнения',
                            value: false,
                        },
                        {
                            id: '2-5',
                            label: 'Длительность',
                            value: false,
                        },
                    ],
                },
                {
                    id: 3,
                    header: {
                        id: 3,
                        label: 'График',
                        value: false,
                    },
                    items: [
                        {
                            id: '3-1',
                            label: 'Автор',
                            value: false,
                        },
                        {
                            id: '3-2',
                            label: 'ID',
                            value: false,
                        },
                        {
                            id: '3-3',
                            label: 'Тип объекта',
                            value: false,
                        },
                    ],
                },
            ],
        }
    },
    computed: {
        map() {
            const map = {}

            for (const group of this.groups) {
                map[group.id] = group
                map[group.id]['children'] = []
            }

            for (const item of this.items) {
                map[item.group_id]['children'].push(item)
            }

            return map
        },
    },
    methods: {
        onSelectGroup(payload) {
            this.items.forEach((item) => {
                if (item.group_id === payload.id) {
                    item.value = payload.value
                }
            })
        },
        onSelectItem(payload) {
            const item = this.items.find((item) => item.id === payload.id)
            item.value = payload.value
        },
    },
}
</script>

<style>
.grid-column-selector {
    display: block;

    padding: 1.5rem;

    background-color: var(--v-container-background-color-light);
}

.grid-column-selector__row {
    display: flex;
}
</style>
