<template>
    <div class="v-progress-spinner" role="alert" aria-busy="true">
        <svg class="v-progress-spinner-svg" viewBox="25 25 50 50" :style="svgStyle">
            <circle class="v-progress-spinner-circle" cx="50" cy="50" r="20" :fill="fill" :stroke-width="strokeWidth" strokeMiterlimit="10" />
        </svg>
    </div>
</template>

<script>
export default {
    props: {
        strokeWidth: {
            type: String,
            default: '2',
        },
        fill: {
            type: String,
            default: 'none',
        },
        animationDuration: {
            type: String,
            default: '2s',
        },
    },
    computed: {
        svgStyle() {
            return {
                'animation-duration': this.animationDuration,
            }
        },
    },
}
</script>

<style>
.v-progress-spinner {
    position: relative;

    display: inline-block;

    width: 100px;
    height: 100px;
    margin: 0 auto;
}

.v-progress-spinner::before {
    content: '';

    display: block;

    padding-top: 100%;
}

.v-progress-spinner-svg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    width: 100%;
    height: 100%;
    margin: auto;

    transform-origin: center center;

    animation: v-progress-spinner-rotate 2s linear infinite;
}

.v-progress-spinner-circle {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: 0;

    stroke: hsl(4deg 74% 48%);

    animation: v-progress-spinner-dash 1.5s ease-in-out infinite, v-progress-spinner-color 6s ease-in-out infinite;
    stroke-linecap: round;
}

@keyframes v-progress-spinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes v-progress-spinner-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }

    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}
@keyframes v-progress-spinner-color {
    100%,
    0% {
        stroke: hsl(4deg 74% 48%);
    }

    40% {
        stroke: hsl(217deg 100% 45%);
    }

    66% {
        stroke: hsl(150deg 100% 26%);
    }

    80%,
    90% {
        stroke: hsl(39deg 100% 50%);
    }
}
</style>
