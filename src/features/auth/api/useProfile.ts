import { ref } from 'vue';

const isLogined = ref(true);

export const useProfile = () => {
  return {
    isLogined
  };
};

