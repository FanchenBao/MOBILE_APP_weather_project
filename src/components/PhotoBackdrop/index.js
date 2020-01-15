import React, {Component} from 'react';
import {ImageBackground, PermissionsAndroid} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {getReadExternalStoragePermission} from '../../functions/get_user_permission.js';
import {styles} from './style.js';

class PhotoBackdrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoURIs: ['dummy/uri'], // record the uri of photos on device.
    };
  }

  /**
   * Get the most recent photo on device.
   *
   * And then store its uri in this.state.photoURIs.
   *
   * @param {string} userDecision User's decision whether to grant the app
   * permission to read external storage.
   */
  _getMostRecentPhoto = async userDecision => {
    try {
      if (userDecision === PermissionsAndroid.RESULTS.GRANTED) {
        let photos = await CameraRoll.getPhotos({first: 1});
        this.setState({photoURIs: photos.edges.map(ele => ele.node.image.uri)});
      } else {
        console.log(
          `Read external storage denied. User decision: ${userDecision}`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    getReadExternalStoragePermission().then(userDecision =>
      this._getMostRecentPhoto(userDecision),
    );
  }

  render() {
    // console.log('rendered');
    return (
      <ImageBackground
        source={{uri: this.state.photoURIs[0]}}
        resizeMode="cover"
        style={styles.backdrop}>
        {this.props.children}
      </ImageBackground>
    );
  }
}

export {PhotoBackdrop};
