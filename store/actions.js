export default {
  async nuxtServerInit(vuexContext, context) {
    const res = await fetch("https://api.db-ip.com/v2/free/self");
    const data = await res.json();
    console.log({ data });

    // console.log("server run init from action.js file");
    // console.log(context);
    // console.log(this.app.apolloProvider.defaultClient);
  }
};
