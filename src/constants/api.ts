import {
  MOCK_API_ENDPOINT as ENV_MOCK_API_ENDPOINT,
  API_ENDPOINT as ENV_API_ENDPOINT,
} from 'react-native-dotenv'

// console.log('ENV_API_ENDPOINT >> ', ENV_API_ENDPOINT)
// console.log('ENV_MOCK_API_ENDPOINT  >> ', ENV_MOCK_API_ENDPOINT)

export const API_ENDPOINT: string = ENV_API_ENDPOINT
export const MOCK_API_ENDPOINT: string = ENV_MOCK_API_ENDPOINT
