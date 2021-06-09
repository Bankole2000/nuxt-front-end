import meQuery from "../graphql/me.gql";

export default {
  async nuxtServerInit(vuexContext, context) {
    const res = await fetch("https://api.db-ip.com/v2/free/self");
    const data = await res.json();
    console.log({ data });
    const { countryCode } = data;

    const client = context.app.apolloProvider.defaultClient;
    try {
      const result = await client.mutate({
        mutation: meQuery,
        variables: {
          countryName: countryCode
        }
      });
      // console.log(context);
      const {
        data: { me: user, countryByCode: country }
      } = result;

      vuexContext.commit("user/setLoggedInUser", { user });
      vuexContext.commit("user/setUserCurrency", country);
      vuexContext.commit("user/setUserLocationCountry", country);
    } catch (err) {
      console.log({ err });
    }
  },
  showLoader(context, { lclass, message }) {
    return new Promise(resolve => {
      context.commit("showLoader", { lclass, message });
      resolve();
    });
  },
  showToast(context, { show, sclass = "", message = "", timeout = 2000 }) {
    return new Promise(resolve => {
      context.commit("showToast", { show, sclass, message, timeout });
      resolve(timeout);
    });
  }
};
