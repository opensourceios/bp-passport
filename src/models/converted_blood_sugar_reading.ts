import {BloodSugar} from '../redux/blood-sugar/blood-sugar.models'

import {convertBloodSugarReading, BloodSugarCode} from '../utils/blood-sugars'

class ConvertedBloodSugarReading implements BloodSugar {
  private _bloodSugarValue: string
  private _bloodSugarType: string
  private _recordedAt: string
  private _facility: any | undefined
  private _offline?: boolean
  private _bloodSugarUnit: BloodSugarCode

  constructor(originalReading: BloodSugar, convertTo: BloodSugarCode) {
    this._bloodSugarValue = convertBloodSugarReading(originalReading, convertTo)
    this._bloodSugarType = originalReading.blood_sugar_type
    this._recordedAt = originalReading.recorded_at
    this._facility = originalReading.facility
    this._offline = originalReading.offline
    this._bloodSugarUnit = convertTo
  }

  public get blood_sugar_value(): string {
    return this._bloodSugarValue
  }

  public get blood_sugar_type(): string {
    return this._bloodSugarType
  }

  public get recorded_at(): string {
    return this._recordedAt
  }

  public get facility(): any | null {
    return this._facility
  }

  public get offline(): boolean | undefined {
    return this._offline
  }

  public get blood_sugar_unit(): BloodSugarCode {
    return this._bloodSugarUnit
  }
}

export default ConvertedBloodSugarReading