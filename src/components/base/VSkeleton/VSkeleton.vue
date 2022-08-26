<template>
    <div class="v-skeleton v-component" :style="containerStyle" :class="containerClass"></div>
</template>

<script>
export default {
    props: {
        shape: {
            type: String,
            default: 'rectangle',
        },
        size: {
            type: String,
            default: null,
        },
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: '1rem',
        },
        borderRadius: {
            type: String,
            default: null,
        },
        animation: {
            type: String,
            default: 'wave',
        },
    },
    computed: {
        containerClass() {
            return [
                {
                    'v-skeleton--circle': this.shape === 'circle',
                    'v-skeleton--none': this.animation === 'none',
                },
            ]
        },
        containerStyle() {
            if (this.size) {
                return { width: this.size, height: this.size, borderRadius: this.borderRadius }
            }

            return { width: this.width, height: this.height, borderRadius: this.borderRadius }
        },
    },
}
</script>

<style>
.v-skeleton {
    position: relative;

    border-radius: 6px;

    background-color: hsl(210deg 14% 89%);

    overflow: hidden;
}

.v-skeleton::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    content: '';
    z-index: 1;

    height: 100%;

    transform: translateX(-100%);
    transform: translateX(-100%);

    animation: v-skeleton-animation 1.2s infinite;
}

.v-skeleton::after {
    background: linear-gradient(90deg, rgb(255 255 255 / 0%), rgb(255 255 255 / 40%), rgb(255 255 255 / 0%));
}

.v-skeleton--circle {
    border-radius: 50%;
}

.v-skeleton--none::after {
    animation: none;
}

@keyframes v-skeleton-animation {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(100%);
    }
}
</style>
