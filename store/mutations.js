export default {
  showToast(state, payload) {
    for (const key in payload) {
      state.toast[key] = payload[key];
    }
    state.toast.icon = payload.sclass ? state.toast.icons[payload.sclass] : "";
  }
};
