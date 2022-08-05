const state = () => ({
  user: null,
});

const getters = {
  user: (state) => {
    return state.user;
  },

  check: (state) => {
    return !!state.user;
  },
};

const actions = {};

const mutations = {
  INIT(state) {
    state.user = window.localStorage.getItem("user") ?? null;
  },
  SET_USER(state, user) {
    state.user = user;
    window.localStorage.setItem("user", user) ?? null;
  },
  DELETE_USER(state) {
    window.localStorage.removeItem("user");
    state.user = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
