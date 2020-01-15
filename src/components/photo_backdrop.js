import React, {Component} from 'react';
import {StyleSheet, Dimensions, ImageBackground} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

class PhotoBackdrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoURIs: null,
    };
  }

  _getFirstPhoto = async () => {
    try {
      let photos = await CameraRoll.getPhotos({first: 1});
      console.log(photos);
      this.setState({photoURIs: photos.map(ele => ele.image.uri)});
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this._getFirstPhoto();
  }

  render() {
    return (
      <ImageBackground
        source={require('../images/background.jpeg')}
        resizeMode="cover"
        style={styles.backdrop}>
        {this.props.children}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export {PhotoBackdrop};
