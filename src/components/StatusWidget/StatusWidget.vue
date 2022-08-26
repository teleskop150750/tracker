<template>
    <div class="status-widget">
        <VPopper offsetDistance="0" placement="bottom-start" :show="showPopper">
            <StatusWidgetTrigger :item="currentStatus" @click="showPopper = true" />
            <template #content="{ close }">
                <StatusWidgetSelectItem
                    v-for="status in statusList"
                    :key="status.id"
                    :item="status"
                    :active="status.id === currentStatus.id"
                    @click="selectStatus(status), close()"
                />
            </template>
        </VPopper>
    </div>
</template>

<script setup>
import StatusWidgetSelectItem from './StatusWidgetSelectItem'
import StatusWidgetTrigger from './StatusWidgetTrigger'
import VPopper from '../base/VPopper/VPopper'
import { ref } from 'vue'

const showPopper = ref(false)
const currentStatus = ref({
    id: 1,
    name: 'Новое',
    color: '207deg 90% 54%',
})

const statusList = [
    {
        id: 1,
        name: 'Новое',
        color: '207deg 90% 54%',
    },
    {
        id: 2,
        name: 'В работе',
        color: '187deg 100% 42%',
    },
    {
        id: 3,
        name: 'Выполнено',
        color: '88deg 50% 53%',
    },
    {
        id: 4,
        name: 'В ожидании',
        color: '0deg 0% 62%',
    },
    {
        id: 5,
        name: 'Отменено',
        color: '0deg 0% 62%',
    },
]

function selectStatus(item) {
    this.currentStatus = item
    this.showPopper = false
}
</script>
