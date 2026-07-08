let counter = 0;
let timer = null;

export const showLoading = () => {
  counter += 1;
  if (counter === 1) {
    timer = window.setTimeout(() => {
      const event = new CustomEvent('global-loading-show');
      window.dispatchEvent(event);
      timer = null;
    }, 200);
  }
};

export const hideLoading = () => {
  counter = Math.max(counter - 1, 0);
  if (counter === 0) {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    const event = new CustomEvent('global-loading-hide');
    window.dispatchEvent(event);
  }
};
