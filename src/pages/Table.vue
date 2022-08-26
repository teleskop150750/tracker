<template>
    <div style="padding: 1rem">
        <button @click="test">33</button>
        <VTable v-model:expanded-keys="expandedKeys" v-model:selected="selected" :columns="table.columns" :rows="table.rows">
            <template #item-index="{ index }"> {{ index + 1 }} </template>
        </VTable>
        <VCheckbox toggle-indeterminate v-model="theModel" label="Did you eat lunch today?" />
        <div>
            {{ selected }}
        </div>
    </div>
</template>

<script>
import VTable from '../components/base/VTable/VTable'
import VCheckbox from '../components/base/VCheckbox/VCheckbox'

export default {
    components: {
        VTable,
        VCheckbox,
    },
    data() {
        return {
            selected: [],
            table: {
                columns: [
                    {
                        text: 'ID',
                        field: 'id',
                        expander: true,
                    },
                    {
                        text: 'Название',
                        field: 'name',
                    },
                ],
                rows: [
                    {
                        id: 1,
                        name: 'name',
                        created_at: '0202',
                        children: [
                            {
                                id: 22,
                                name: 'name2',
                                created_at: '0202',
                                canSelect: true,
                                children: [
                                    { id: 346, name: '2222', created_at: '0202', canSelect: true },
                                    {
                                        id: 33,
                                        name: 'name2',
                                        created_at: '0202',
                                        canSelect: true,
                                    },
                                    {
                                        id: 32,
                                        name: 'name2',
                                        created_at: '0202',
                                        canSelect: true,
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
                                children: [
                                    {
                                        id: 34,
                                        name: 'name2',
                                        created_at: '0202',
                                        canSelect: true,
                                    },
                                    {
                                        id: 35,
                                        name: 'name2',
                                        created_at: '0202',
                                        canSelect: true,
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
                        name: 'name2',
                        created_at: '0202',
                    },
                    {
                        id: 6,
                        name: 'name2',
                        created_at: '0202',
                    },
                    {
                        id: 7,
                        name: 'name2',
                        created_at: '0202',
                    },
                    {
                        id: 8,
                        name: 'name2',
                        created_at: '0202',
                    },
                    {
                        id: 9,
                        name: 'name2',
                        created_at: '0202',
                    },
                ],
            },
        }
    },
    methods: {
        test() {
            if (this.expandedKeys[22]) {
                this.expandedKeys = { 1: true }
            } else {
                this.expandedKeys = { 1: true, 22: true }
            }
        },
    },
}
</script>
