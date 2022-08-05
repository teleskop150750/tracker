<template>
  <div class="fm-login-box">
    <div class="fm-login-box__inner">
      <div class="fm-login-box__column fm-login-box__column--image">
        <img
          class="fm-login-box__image"
          src="https://windmill-dashboard.vercel.app/assets/img/forgot-password-office.jpeg"
          alt=""
        />
      </div>
      <div class="fm-login-box__column fm-login-box__column--form">
        <slot />
        <div class="fm-login-box__column-footer" v-if="$slots['footer']">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fm-login-box {
  width: 100%;
  max-width: 56rem;
  margin: 0 auto;

  border: 0 solid hsl(210deg 2% 84%);
  border-radius: 0.5rem;

  background-color: rgb(255 255 255);

  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%),
    0 10px 10px -5px rgb(0 0 0 / 4%);
}

.fm-login-box__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.fm-login-box__column--image {
  position: relative;
}

.fm-login-box__image {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;
}

.fm-login-box__column--form {
  padding: 3rem;
}

.fm-login-box__column-footer {
  margin-top: 2rem;
}
</style>
