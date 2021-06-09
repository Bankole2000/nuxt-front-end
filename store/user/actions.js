import loginMutation from "../../graphql/login.gql";
import logoutMutation from "../../graphql/logout.gql";

export default {
  async onLogin({ commit }, payload) {
    const { email, username, password } = payload;
    const client = this.app.apolloProvider.defaultClient;
    try {
      const result = await client.mutate({
        mutation: loginMutation,
        variables: {
          username,
          email,
          password
        }
      });
      console.log(result);
      const {
        data: {
          signIn: { user }
        }
      } = result;
      if (user) {
        commit("setLoggedInUser", { user });
      }
    } catch (err) {
      console.log({ err });
    }
  },
  async onLogout({ commit }) {
    const client = this.app.apolloProvider.defaultClient;
    try {
      const result = await client.mutate({
        mutation: logoutMutation
      });
      console.log(result);
      const {
        data: {
          signOut: { user }
        }
      } = result;
      commit("setLoggedInUser", { user });
    } catch (err) {
      console.log({ err });
    }
  }
};
