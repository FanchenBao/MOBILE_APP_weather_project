import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'column',
    // borderColor: 'yellow',
    // borderWidth: 2,
  },
  rowOne: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //borderColor: 'green',
    //borderWidth: 2,
  },
  rowTwo: {
    flex: 2,
    flexDirection: 'row',
    //borderColor: 'orange',
    //borderWidth: 2,
  },
  category: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //borderColor: 'brown',
    //borderWidth: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //borderColor: 'purple',
    //borderWidth: 2,
  },
});

export {styles};
