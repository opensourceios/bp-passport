import React, {useState, useContext} from 'react'
import {SafeAreaView, View, TextInput, Alert} from 'react-native'
import {FormattedMessage, useIntl} from 'react-intl'
import {StackNavigationProp} from '@react-navigation/stack'
import {RouteProp} from '@react-navigation/native'

import {containerStyles, colors} from '../styles'
import {BodyText, Button, BodyHeader} from '../components'
import SCREENS from '../constants/screens'
import {RootStackParamList} from '../Navigation'
import {authActivate} from '../api'
import {AuthContext} from '../providers/auth.provider'

type VerifyNumberRouteProp = RouteProp<
  RootStackParamList,
  SCREENS.VERIFY_YOUR_NUMBER
>

type VerifyNumberScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  SCREENS.VERIFY_YOUR_NUMBER
>

type Props = {
  navigation: VerifyNumberScreenNavigationProp
  route: VerifyNumberRouteProp
}

enum UIState {
  Normal,
  CallingAPI,
}

function VerifyNumber({navigation, route}: Props) {
  // Todo - implement ActivityIndicator UI while api being called
  const [uiState, setUIState] = useState(UIState.Normal)

  const {setAuthParams} = useContext(AuthContext)

  const intl = useIntl()

  const [input, setInput] = useState('')
  const [codeError, setCodeError] = useState(false)

  const {passport_id} = route.params
  console.log('passport_id: ', passport_id)

  const verifyOTP = (otp: string) => {
    if (uiState === UIState.Normal) {
      setUIState(UIState.CallingAPI)

      return authActivate({passport_id, otp})
        .then((authParams) => {
          if (authParams) {
            setAuthParams(authParams)
          }
        })
        .catch((error: Error) => {
          Alert.alert(
            'Error',
            `${error}`,
            [
              {
                text: 'OK',
                onPress: () => {},
              },
            ],
            {cancelable: false},
          )
        })
        .finally(() => {
          setUIState(UIState.Normal)
        })
    }
  }

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={[containerStyles.fill, {backgroundColor: colors.white}]}>
        <View style={{margin: 24}}>
          <BodyText style={{textAlign: 'center'}}>
            <FormattedMessage id="verify-pin.please-verify" />
          </BodyText>
          <TextInput
            style={{
              width: '100%',
              height: 56,
              borderRadius: 4,
              backgroundColor: colors.white100,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: colors.grey2,
              padding: 16,
              fontSize: 16,
              fontWeight: 'normal',
              fontStyle: 'normal',
              letterSpacing: 0.5,
              color: colors.grey0,
              marginTop: 36,
            }}
            placeholder={intl.formatMessage({id: 'verify-pin.code'})}
            onChangeText={(text) => setInput(text)}
            value={input}
            keyboardType={'numeric'}
          />
          <Button
            style={{marginTop: 24}}
            onPress={() => {
              verifyOTP(input)
            }}
            title={intl.formatMessage({id: 'general.verify'})}
          />
          {codeError && (
            <BodyHeader
              style={{
                fontSize: 16,
                color: colors.red1,
                textAlign: 'center',
              }}>
              <FormattedMessage id="verify-pin.wrong-pin" />
            </BodyHeader>
          )}
          <BodyHeader
            style={{
              color: colors.grey1,
              width: '100%',
              textAlign: 'center',
              marginTop: 16,
            }}>
            <FormattedMessage id="verify-pin.no-pin" />{' '}
            <BodyHeader style={{color: colors.blue2}}>
              <FormattedMessage id="verify-pin.resend-sms-link" />
            </BodyHeader>
          </BodyHeader>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default VerifyNumber