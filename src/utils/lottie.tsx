export const loadLottie = () => {
  try {
    return require('lottie-react-native');
  } catch (error) {
    console.warn(
      'Lottie is not installed, falling back to text-based typing effect.'
    );
  }
};
