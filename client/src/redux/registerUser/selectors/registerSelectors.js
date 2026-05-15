// src/redux/selectors/loginSelectors.js
//reading from the store

export const selectLoginLoading = (state) => state.login.loading;
export const selectLoginError   = (state) => state.login.error;
export const selectLoginUser    = (state) => state.login.user;

 
export const selectRegisterLoading = (state) => state.register.loading;
export const selectRegisterSuccess = (state) => state.register.success;
export const selectRegisterError   = (state) => state.register.error;
export const selectRegisterUser    = (state) => state.register.user;