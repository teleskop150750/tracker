<template>
    <div style="height: 1300px"></div>
    <div class="test">
        <h5>Basic</h5>
        <VDatePicker v-model="data2" />

        <Popper content="This is the Popper content 🍿">
            <TextField readonly autocomplete="off" v-model="data" />
            <template #content>
                <div class="date-wr">
                    <VDate v-model="data" />
                </div>
            </template>
        </Popper>
        <Popper>
            <button>Trigger element</button>
            <template #content>
                <div class="date-wr">
                    <div>This is the Popper content 🍿</div>
                </div>
            </template>
        </Popper>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import TextField from '../components/base/VTextField/VTextField.vue'
import VBtn from '../components/base/VBtn/VBtn.vue'
import VDate from '../components/base/VDate/VDate.vue'
import VDatePicker from '../components/base/VDatePicker/VDatePicker.vue'
import Popper from '../components/base/VPopper/VPopper.vue'

const data = ref(null)
const data2 = ref(null)
</script>

<style>
.date-wr {
    width: 290px;
    height: 396px;
    background: #000;
}

.scroller-app {
    height: 200px;

    overflow: auto;
}

.test {
    height: 100vh;
    padding-left: 200px;
}
</style>
