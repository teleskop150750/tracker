<template>
  <div class="v-form-card">
    <slot />
    <div class="v-form-card__footer" v-if="$slots['footer']">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
.v-form-card {
  width: 100%;
  max-width: 24rem;
  padding: 2rem;

  border: 0 solid hsl(210deg 2% 84%);
  border-radius: 0.5rem;

  background-color: rgb(255 255 255);

  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%),
    0 10px 10px -5px rgb(0 0 0 / 4%);
}

.v-form-card__footer {
  margin-top: 1rem;
}
</style>
