import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response) {
    // Backenddan kelgan xatolik xabari
    return error.response.data.message || "An unexpected error occurred.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred.";
};
