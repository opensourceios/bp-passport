import React, {useEffect} from 'react'
import {View, Image} from 'react-native'

import {iconLaunch, containerStyles, colors} from '../styles'
import SCREENS from '../constants/screens'

function LaunchScreen({navigation}: any) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace(SCREENS.MAIN_STACK)
    }, 2000)
  }, [])

  return (
    <View
      style={[
        containerStyles.fill,
        containerStyles.centeredContent,
        {backgroundColor: colors.black},
      ]}>
      <Image source={iconLaunch} />
      <View />
    </View>
  )
}

export default LaunchScreen
