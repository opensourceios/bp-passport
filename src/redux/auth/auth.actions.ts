import axios, {AxiosResponse} from 'axios'
import {API_ENDPOINT} from '../../constants/api'
import {AuthActionTypes} from './auth.types'
import {AppThunk} from '../store'
import {LoginState, AuthParams, PassportLinkedState} from './auth.models'
import {getPatient} from '../patient/patient.actions'
import analytics from '@react-native-firebase/analytics'

export const setAuthParams = (authParams: AuthParams | undefined) => ({
  type: AuthActionTypes.SET_AUTH_PARAMS,
  payload: authParams,
})

export const logout = () => ({
  type: AuthActionTypes.LOG_OUT,
})

export const setLoginState = (loginState: LoginState) => ({
  type: AuthActionTypes.SET_LOGIN_STATE,
  payload: loginState,
})

export const setPassportLinkedState = (
  passportLinkedState: PassportLinkedState,
) => ({
  type: AuthActionTypes.SET_PASSPORT_LINKED_STATE,
  payload: passportLinkedState,
})

export const activate = (
  passportId: string,
): AppThunk<Promise<boolean>> => async () => {
  try {
    await axios.post(`${API_ENDPOINT}/patient/activate`, {
      passport_id: passportId,
    })
    return true
  } catch (err) {
    const response: AxiosResponse | undefined = err.response
    if (response && response.status) {
      if (response.status === 404) {
        throw new Error("Can't verify account")
      }
    }
    throw err
  }
}

export const login = (passportId: string, otp: string): AppThunk => async (
  dispatch,
) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/patient/login`, {
      passport_id: passportId,
      otp,
    })
    const authParams: AuthParams = response.data?.patient
    if (
      !authParams.id ||
      !authParams.access_token ||
      !authParams.passport ||
      !authParams.passport.id ||
      !authParams.passport.shortcode
    ) {
      throw new Error('Invalid auth data')
    }

    dispatch(setAuthParams(authParams))
    dispatch(setLoginState(LoginState.LoggedIn))
    dispatch(setPassportLinkedState(PassportLinkedState.Linking))
    dispatch(getPatient())

    analytics()
      .setUserProperty('has_passport', 'true')
      .then(() => {
        console.log('User has_passport set')
      })
      .catch((err) => {
        console.log('Analytics >> has_passport failed', err)
      })

    analytics()
      .logEvent('linked_passport', {
        passportId,
      })
      .then(() => {
        console.log('Analytics >> link passport worked')
      })
      .catch((err) => {
        console.log('Analytics >> link passport failed', err)
      })

    return true
  } catch (err) {
    throw err
  }
}

export const loginNoApi = () => ({
  type: AuthActionTypes.SET_LOGIN_STATE,
  payload: LoginState.LoggedIn,
})
