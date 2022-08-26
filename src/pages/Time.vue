<template>
    <div style="padding: 1rem">
        <div>
            <div>
                <h5>Basic</h5>
                <Dropdown v-model="selectedCity1" :options="cities" optionLabel="name" optionValue="code" placeholder="Select a City" />
                <!-- <VDropdown v-model="selectedCity1" :options="cities" optionLabel="name" optionValue="code" placeholder="Select a City" /> -->
            </div>
            <div>
                <h5>Editable</h5>
                <Dropdown v-model="selectedCity2" :options="cities" optionLabel="name" :editable="true" />
                <!-- <VDropdown v-model="selectedCity2" :options="cities" optionLabel="name" :editable="true" /> -->
            </div>
            <div>
                <h5>Grouped</h5>
                <Dropdown
                    v-model="selectedGroupedCity"
                    :options="groupedCities"
                    optionLabel="label"
                    optionGroupLabel="label"
                    optionGroupChildren="items"
                >
                    <template #optiongroup="slotProps">
                        <div class="flex align-items-center country-item">
                            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" width="18" />
                            <div>{{ slotProps.option.label }}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div>
                <h5>Advanced with Templating, Filtering and Clear Icon</h5>
                <Dropdown
                    v-model="selectedCountry"
                    :options="countries"
                    optionLabel="name"
                    :filter="true"
                    placeholder="Select a Country"
                    :showClear="true"
                >
                    <template #value="slotProps">
                        <div class="country-item country-item-value" v-if="slotProps.value">
                            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" width="10" height="10" />
                            <div>{{ slotProps.value.name }}</div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="country-item">
                            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" width="10" height="10" />
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>

            <div>
                <h5>Loading State</h5>
                <Dropdown placeholder="Loading..." loading></Dropdown>
            </div>

            <div>
                <h5>Virtual Scroll (1000 Items)</h5>
                <!-- <Dropdown
                    v-model="selectedItem1"
                    :options="items"
                    optionLabel="label"
                    optionValue="value"
                    :virtualScrollerOptions="{ itemSize: 38 }"
                    placeholder="Select Item"
                ></Dropdown> -->
            </div>

            <div>
                <h5>Virtual Scroll (1000 Items) and Lazy</h5>
                <!-- <Dropdown
                    v-model="selectedItem2"
                    :options="lazyItems"
                    optionLabel="label"
                    optionValue="value"
                    :virtualScrollerOptions="{
                        lazy: true,
                        onLazyLoad: onLazyLoad,
                        itemSize: 38,
                        showLoader: true,
                        loading: loading,
                        delay: 250,
                    }"
                    placeholder="Select Item"
                >
                    <template v-slot:loader="{ options }">
                        <div class="flex align-items-center p-2" style="height: 38px">
                            <Skeleton :width="options.even ? '60%' : '50%'" height="1rem" />
                        </div>
                    </template>
                </Dropdown> -->
            </div>
        </div>
        <VBtn label="Show" />
        <div>
            {{ displayBasic }}
            <VBtn ref="trigger" label="Show" @click="openBasic" />
            <VBtn label="Close" @click="closeBasic" />
            <Dialog position="top-right" header="Header" v-model:visible="displayBasic" :clickOutside="listener" :style="{ width: '50vw' }">
                <VBtn label="Show" @click="openBasic2" />
                <Dialog
                    position="top-right"
                    header="Header"
                    clickOutside
                    v-model:visible="displayBasic2"
                    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
                    :style="{ width: '50vw' }"
                >
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <template #footer>
                        <VBtn label="No" @click="closeBasic2" class="p-button-text" />
                        <VBtn label="Yes" @click="closeBasic" />
                    </template>
                </Dialog>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
                    aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <template #footer>
                    <VBtn label="No" @click="closeBasic" class="p-button-text" />
                    <VBtn label="Yes" @click="closeBasic" />
                </template>
            </Dialog>
        </div>
        <div>
            <!-- <VBtn :loading="false" :icon="VCloseIcon" label="text"></VBtn> -->

            <VBtn :loading="false" label="TEXT"></VBtn>
            <VBtn :loading="false" label="TEXT"></VBtn>
            <VBtn :loading="false" label="TEXT"></VBtn>
            <!-- <VBtn outline :loading="false" label="outline"></VBtn> -->
            <!-- <VBtn flat :loading="false" label="flat"></VBtn> -->
            <!-- <VBtn rounded :loading="false" label="rounded"></VBtn> -->
            <!-- <VBtn round :loading="false" label="round"></VBtn> -->
            <!-- <VBtn dense :loading="false" label="dense"></VBtn> -->
            <!-- <VBtn round dense :loading="false" label="d"></VBtn> -->
            <!-- <div>
                <VBtn full :loading="false" label="TEXT"></VBtn>
            </div> -->
        </div>
        <div>
            <VSpinner />
        </div>
        {{ date }}
        <div>
            <VDate v-model="date">2</VDate>
        </div>
    </div>
</template>

<script setup>
import VCloseIcon from '../components/icons/VCloseIcon.vue'
import VDropdown from '../components/base/VDropdown/VDropdown'
import Dropdown from '../components/base/VDropdown/Dropdown'
import Skeleton from '../components/base/VSkeleton/VSkeleton'
import Dialog from '../components/base/VDialog/VDialog'
import VDate from '../components/base/VDate/VDate'
import VSpinner from '../components/base/VSpinner/VSpinner'
import VBtn from '../components/base/VBtn/VBtn'
import { ref, unref } from 'vue'

const selectedCity1 = ref()
const selectedCity2 = ref()
const selectedCountry = ref()
const selectedGroupedCity = ref()
const selectedItem1 = ref()
const selectedItem2 = ref()
const loading = ref(false)
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
])
const countries = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' },
])
const groupedCities = ref([
    {
        label: 'Germany',
        code: 'DE',
        items: [
            { label: 'Berlin', value: 'Berlin' },
            { label: 'Frankfurt', value: 'Frankfurt' },
            { label: 'Hamburg', value: 'Hamburg' },
            { label: 'Munich', value: 'Munich' },
        ],
    },
    {
        label: 'USA',
        code: 'US',
        items: [
            { label: 'Chicago', value: 'Chicago' },
            { label: 'Los Angeles', value: 'Los Angeles' },
            { label: 'New York', value: 'New York' },
            { label: 'San Francisco', value: 'San Francisco' },
        ],
    },
    {
        label: 'Japan',
        code: 'JP',
        items: [
            { label: 'Kyoto', value: 'Kyoto' },
            { label: 'Osaka', value: 'Osaka' },
            { label: 'Tokyo', value: 'Tokyo' },
            { label: 'Yokohama', value: 'Yokohama' },
        ],
    },
])

const date = ref('2019/02/01')
// const date = ref([])
// const date = ref({ from: '2020/07/08', to: '2020/07/17' })

const trigger = ref(null)
const log = (event) => {
    // console.log(event)
    console.log('log: ', event.defaultPrevented)
}

const displayBasic = ref(false)
const displayBasic2 = ref(false)

const openBasic = () => {
    displayBasic.value = true
}
const openBasic2 = () => {
    displayBasic2.value = true
}

const closeBasic = () => {
    displayBasic.value = false
}

const closeBasic2 = () => {
    displayBasic2.value = false
}

const listener = (event) => {
    const el = unref(trigger.value.ref)

    if (el === event.target || event.composedPath().includes(el)) {
        return false
    }

    return true
}

let loadLazyTimeout = null
const items = ref(Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i })))
const lazyItems = ref(Array.from({ length: 100000 }))

const onLazyLoad = (event) => {
    loading.value = true

    if (loadLazyTimeout) {
        clearTimeout(loadLazyTimeout)
    }

    //imitate delay of a backend call
    loadLazyTimeout = setTimeout(() => {
        const { first, last } = event
        const thisLazyItems = [...lazyItems.value]

        for (let i = first; i < last; i++) {
            thisLazyItems[i] = { label: `Item #${i}`, value: i }
        }

        lazyItems.value = thisLazyItems
        loading.value = false
    }, Math.random() * 1000 + 250)
}
</script>

<style></style>
