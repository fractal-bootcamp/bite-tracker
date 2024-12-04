import AsyncStorage from "@react-native-async-storage/async-storage";

const clearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("Local storage cleared successfully.");
  } catch (e) {
    console.error("Failed to clear local storage:", e);
  }
};
export default clearLocalStorage;
