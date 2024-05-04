// store.js
import create from 'zustand';

const useStore = create(set => ({
  showResources: false,
  toggleShowResources: () => set(state => ({ showResources: !state.showResources }))
}));

export default useStore;
