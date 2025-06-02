import { ref } from "vue";
import type { AuthResponse } from "../model/types";

export async function useProfile() {
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const isLogined = ref(false);

  if (token) {
    isLogined.value = true;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/secure-storage/user/${user_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Profile failed: ${response.statusText}`);
  }

  const data: AuthResponse = await response.json();
  return { isLogined, data };
}
