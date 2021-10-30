import React, { useState } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import MapView, { Marker } from 'react-native-maps'

export default function App() {
  const Data = {
    id: 0,
    distance: 0,
    latitude: 37.37631358163734,
    longitude: 127.1104295264883
  }

  const [data, setData] = useState(Data)

  axios.get('http://chul0721.iptime.org:25565/data', {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
    .then((response: any) => {
      setData(response.data)
    })

  const [ mapRegion ] = useState({
    latitude: data.latitude,
    longitude: data.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  })

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