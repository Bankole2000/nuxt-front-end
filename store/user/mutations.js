export default {
  setLoggedInUser(state, { user }) {
    state.user = user;
  },
  setUserCurrency(state, { currency }) {
    state.userCurrency = currency;
  },
  setUserLocationCountry(state, location) {
    if (location.currency) {
      delete location.currency;
    }
    state.userCountry = location;
  }
};
