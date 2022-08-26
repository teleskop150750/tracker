<template>
    <div>
        <VTable :can-select-row="canSelectRow" v-model:selected="selected" :columns="columns" :rows="rows">
            <template #body-cell-index="{ index }">
                <div>{{ index }}</div>
            </template>
            <template #body-cell-level="{ level }">
                <div>{{ level }}</div>
            </template>
            <template #body-cell-leaf="{ isLeaf }">
                <div>{{ isLeaf }}</div>
            </template>
        </VTable>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import VCheckbox from '../components/base/VCheckbox/VCheckbox.vue'
import VTable from '../components/base/VTable/VTable.vue'
// import { RecycleScroller } from 'vue-virtual-scroller'

// const items = ref(Array.from({ length: 30000 }, (_, i) => ({ name: `Item #${i}`, id: i })))
// const virtualRef = ref()
const theModel = ref(null)

const click = () => {
    virtualRef.value.scrollToItem(400)
}

const selected = ref([{ id: 3, name: 'name2', created_at: '0202', _index: 12 }])

const columns = [
    {
        text: 'ID',
        field: 'id',
        expander: true,
    },
    {
        text: 'Index',
        field: 'index',
    },
    {
        text: 'level',
        field: 'level',
    },
    {
        text: 'leaf',
        field: 'leaf',
    },
    {
        text: 'Название',
        field: 'name',
    },
]

const rows = [
    {
        id: 1,
        name: 'name',
        created_at: '0202',
        type: 'dir',
        children: [
            {
                id: 22,
                name: 'name2',
                created_at: '0202',
                type: 'dir',
                children: [
                    { id: 346, name: '2222', created_at: '0202', canSelect: true },
                    {
                        id: 33,
                        name: 'name2',
                        created_at: '0202',
                        type: 'task',
                    },
                    {
                        id: 32,
                        name: 'name2',
                        created_at: '0202',
                        type: 'task',
                        children: [
                            {
                                id: 41,
                                name: 'name2',
                                created_at: '0202',
                                canSelect: true,
                            },
                            {
                                id: 42,
                                name: 'name2',
                                created_at: '0202',
                                canSelect: true,
                            },
                        ],
                    },
                ],
            },
            {
                id: 23,
                name: 'name2',
                created_at: '0202',
                type: 'task',
                children: [
                    {
                        id: 34,
                        name: 'name2',
                        created_at: '0202',
                        type: 'task',
                    },
                    {
                        id: 35,
                        name: 'name2',
                        created_at: '0202',
                        type: 'task',
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'name2',
        created_at: '0202',
    },
    {
        id: 3,
        name: 'name2',
        created_at: '0202',
    },
    {
        id: 4,
        name: 'name2',
        created_at: '0202',
    },
    {
        id: 5,
        type: 'dir',
        name: 'name2',
        created_at: '0202',
    },
    {
        id: 6,
        type: 'dir',
        name: 'name2',
        created_at: '0202',
    },
    {
        id: 7,
        type: 'dir',
        name: 'name2',
        created_at: '0202',
    },
    {
        id: 8,
        type: 'dir',
        name: 'name2',
        created_at: '0202',
    },
    {
        id: 9,
        name: 'name2',
        created_at: '0202',
    },
]

function canSelectRow(row) {
    return row.type !== 'dir'
}
</script>

<style>
.container {
    height: 300px;
}

.scroller {
    height: 100%;
}

/* .user {
    height: 50px;
    padding: 0 12px;
    display: flex;
    align-items: center;
}

.user:nth-child(even) {
    background-color: aqua;
} */
</style>
