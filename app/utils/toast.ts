import Toast from "react-native-toast-message";

export const showToast = {
  success: (message: string) => {
    Toast.show({
      type: "success",
      text1: "Success",
      text2: message,
      visibilityTime: 3000,
      position: "top",
    });
  },
  error: (message: string) => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: message,
      visibilityTime: 3000,
      position: "top",
    });
  },
};
