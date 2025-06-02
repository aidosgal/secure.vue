import { ref } from "vue";
import type { User } from "../model/types";

const isAuthModalOpen = ref(false);

export const useAuthModal = () => {
  const openAuthModal = () => {
    isAuthModalOpen.value = true;
  };

  const closeAuthModal = () => {
    isAuthModalOpen.value = false;
  };

  return {
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };
};
export async function login(): Promise<User> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api-token-auth/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data: AuthResponse = await response.json();
  return data;
}
