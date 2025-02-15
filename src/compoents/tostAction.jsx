// toastActions.js
export const showToast = (message, type = 'success') => {
  return {
    type: 'SHOW_TOAST',
    payload: { message, type },
  };
};

export const hideToast = () => {
  return {
    type: 'HIDE_TOAST',
  };
};
