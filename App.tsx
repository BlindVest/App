import React, { useState } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import MapView, { Marker } from 'react-native-maps'

interface Props {
  id: 0,
  distance: 0,
  latitude: 37.37631358163734,
  longitude: 127.1104295264883
}

export default class App extends React.Component<{}, any>  {
  constructor(props: Props) {
    super(props)
    this.state = {
      id: 0,
      distance: 0,
      latitude: 37.37631358163734,
      longitude: 127.1104295264883
    }
  }
  componentDidMount() {
    axios.get('http://18.116.239.41:8080/data', {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
      .then((response: any) => {
        this.setState(response.data)
        console.log(response.data)
      })
  }

  render() {
    const mapRegion = {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }

    return (
      <View>
        <MapView
          style={{ alignSelf: 'stretch', height: '100%' }}
          initialRegion={mapRegion}
        >
          <Marker
            coordinate={mapRegion}
          />
        </MapView>
      </View>
    )
  }
}