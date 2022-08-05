<script>
// import UserService from "../services/UserService";
import VForm from "../components/base/VForm";
import VTextField from "../components/base/VTextField";
import VFormCard from "../components/base/VFormCard";
import VButton from "../components/base/VButton";
import VLink from "../components/base/VLink";
import VTitle from "../components/base/VTitle";

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
    async register() {
      try {
        if (this.user.login === "" || this.user.password === "") {
          return;
        }
        // await UserService.register(this.user);
        this.$router.push({ name: "login" });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>
  <VFormCard>
    <VForm @submit="register">
      <template #header>
        <VTitle>Create account</VTitle>
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
        <VButton block type="submit">Create account</VButton>
      </template>
    </VForm>

    <template #footer>
      <VLink :to="{ name: 'login' }" label="Already have an account? Login" />
    </template>
  </VFormCard>
</template>
