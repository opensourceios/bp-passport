import React from 'react'
import {MedicationActionTypes} from './medication.types'
import {AuthActionTypes} from '../auth/auth.types'
import {Medication} from './medication.models'
import AsyncStorage from '@react-native-community/async-storage'
import {persistReducer} from 'redux-persist'

const ALL_MEDICINE_NAMES: Medication[] = require('../../assets/data/medicines.json')

const INITIAL_STATE: {
  medications?: Medication[]
  medicationsLibrary: Medication[]
} = {
  medications: undefined,
  medicationsLibrary: ALL_MEDICINE_NAMES,
}

const sortedMedications = (medications: Medication[]) => {
  const pure = [...medications]
  /*
    pure.sort((a: Medication, b: Medication) => {
      return isBefore(new Date(a.recorded_at), new Date(b.recorded_at)) ? 1 : -1
    })
    */
  return pure
}

const uniqueKeyForBP = (medication: Medication) => {
  return medication.name
}

const mergeMedications = (medications: Medication[]) => {
  const byUniqueKey: {[key: string]: Medication} = {}
  medications.map((med) => {
    const key = uniqueKeyForBP(med)
    byUniqueKey[key] = med
  })
  return sortedMedications(Object.values(byUniqueKey))
}

const medicationReducer = (state = INITIAL_STATE, action) => {
  const medications: Medication[] = state.medications ?? []
  const newMedications: Medication[] = action.payload ?? []
  const medication: Medication = action.payload
  switch (action.type) {
    case MedicationActionTypes.MERGE_MEDICATIONS:
      return {
        ...state,
        medications: mergeMedications([...medications, ...newMedications]),
      }
    case MedicationActionTypes.ADD_MEDICATION:
      return {
        ...state,
        medications: mergeMedications([...medications, medication]),
      }
    case MedicationActionTypes.DELETE_MEDICATION:
      const isOfflineBP = medication.offline ?? false
      if (!isOfflineBP) {
        // No deleting the online Medications!
        return {
          ...state,
        }
      }
      const keyRemove = uniqueKeyForBP(medication)
      const medicationsFiltered = medications.filter((med) => {
        return uniqueKeyForBP(med) !== keyRemove
      })
      return {
        ...state,
        medications: medicationsFiltered,
      }
    case AuthActionTypes.LOG_OUT:
      return {
        ...INITIAL_STATE,
      }
    default:
      return state
  }
}

const persistConfig = {
  key: 'medication',
  storage: AsyncStorage,
  blacklist: ['medicationsLibrary'],
}

export default persistReducer(persistConfig, medicationReducer)