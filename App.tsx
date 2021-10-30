import React, { useState, useEffect, useRef } from 'react'
import { Text, View, Button, Platform } from 'react-native'
import axios from 'axios'
import MapView, { Marker } from 'react-native-maps'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

export default function App() {
  const Data = {
    id: 0,
    distance: 0,
    latitude: 37.37631358163734,
    longitude: 127.1104295264883
  }

  const [data, setData] = useState(Data)
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification]: any = useState(false)
  const notificationListener: any = useRef()
  const responseListener: any = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: any) => setExpoPushToken(token))

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  axios.get('http://chul0721.iptime.org:25565/data', {
    headers: {
      'Content-Type': 'text/plain'
    }
  })
    .then((response: any) => {
      setData(response.data)
      if(response.data.shock == 1) {
        sendPushNotification(expoPushToken)
      }
    })

  const [mapRegion] = useState({
    latitude: data.latitude,
    longitude: data.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  })

  return (
    <View>
      <MapView style={{ alignSelf: 'stretch', height: '100%' }} initialRegion={mapRegion}>
        <Marker coordinate={mapRegion} />
      </MapView>
    </View>
  )
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken: any) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: '위험 상황 발생',
    body: '착용자에게서 충격이 감지 되었습니다.',
    data: { someData: 'goes here' }
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
}

async function registerForPushNotificationsAsync() {
  let token
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  return token
}
