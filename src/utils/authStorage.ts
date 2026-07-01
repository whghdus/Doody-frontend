import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';

export const authStorage = {
  /**
   * Save the authorization token securely
   */
  setToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save token to SecureStore', error);
      throw error;
    }
  },

  /**
   * Retrieve the stored token
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve token from SecureStore', error);
      return null;
    }
  },

  /**
   * Delete the stored token
   */
  deleteToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to delete token from SecureStore', error);
      throw error;
    }
  },
};
