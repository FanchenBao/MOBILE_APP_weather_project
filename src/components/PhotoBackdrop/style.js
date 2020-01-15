import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export {styles};
