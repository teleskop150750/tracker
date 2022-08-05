<script>
import VForm from "../components/base/VForm";
import VTextField from "../components/base/VTextField";
import VFormCard from "../components/base/VFormCard";
import VButton from "../components/base/VButton";
import VLink from "../components/base/VLink";
import VTitle from "../components/base/VTitle";
// import UserService from "../services/UserService";

export default {
  components: {
    VForm,
    VTextField,
    VButton,
    VFormCard,
    VLink,
    VTitle,
  },
  data() {
    return {
      user: {
        login: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      try {
        if (this.user.login === "" || this.user.password === "") {
          return;
        }

        // const response = await UserService.login(this.user);
        await this.$store.commit("auth/SET_USER", {
          ...this.user,
        });
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>
  <VFormCard>
    <VForm @submit="login">
      <template #header>
        <VTitle>Login</VTitle>
      </template>

      <VTextField
        class="v-form__field"
        label="Login"
        name="login"
        placeholder="admin"
        v-model.trim="user.login"
      />

      <VTextField
        class="v-form__field"
        label="Password"
        name="password"
        placeholder="password"
        v-model.trim="user.password"
      />

      <template #footer>
        <VButton block type="submit">Log in</VButton>
      </template>
    </VForm>

    <template #footer>
      <VLink :to="{ name: 'register' }" label="Create account" />
    </template>
  </VFormCard>
</template>
