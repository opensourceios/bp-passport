import React, {useState, useEffect} from 'react'
import {View, Dimensions} from 'react-native'
import {format} from 'date-fns'
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryTooltip,
  PaddingProps,
} from 'victory-native'

import {BloodPressure} from '../redux/blood-pressure/blood-pressure.models'
import {colors} from '../styles'

interface BloodPressureChartPoint extends BloodPressure {
  index: number
}

type Props = {
  bps: BloodPressure[]
}

export const BpHistoryChart = ({bps}: Props) => {
  const [highBps, setHighBps] = useState<BloodPressureChartPoint[]>([])
  const [lowBps, setLowBps] = useState<BloodPressureChartPoint[]>([])

  const isBloodPressureHigh = (bpIn: BloodPressure) => {
    // A “High BP” is a BP whose Systolic value is greater than or equal to 140 or whose
    // Diastolic value is greater than or equal to 90. All other BPs are “Normal BP”.
    return bpIn.systolic >= 140 || bpIn.diastolic >= 90
  }

  useEffect(() => {
    const reduction = bps.reduce(
      (
        memo: {high: BloodPressureChartPoint[]; low: BloodPressureChartPoint[]},
        current,
        index,
      ) => {
        if (isBloodPressureHigh(current)) {
          memo.high.push({...current, index})
        } else {
          memo.low.push({...current, index})
        }
        return memo
      },
      {high: [], low: []},
    )

    setHighBps(reduction.high)
    setLowBps(reduction.low)
  }, [bps])

  const padding: PaddingProps = {left: 8, top: 10, right: 100, bottom: 30}
  return (
    <View
      style={{
        borderColor: colors.grey3,
        borderLeftWidth: 1,
        borderTopWidth: 1,
      }}>
      <VictoryChart
        style={{
          parent: {
            backgroundColor: 'yellow',
          },
        }}
        padding={padding}
        theme={VictoryTheme.material}>
        <VictoryAxis
          tickCount={4}
          tickValues={bps.map((bp) => bp.recorded_at)}
          tickFormat={(tick) => {
            return format(new Date(tick), 'dd/MM/yy')
          }}
          style={{
            grid: {stroke: colors.grey3, strokeDasharray: 8},
            axis: {stroke: colors.grey3, opacity: 0},
            ticks: {opacity: 0},
          }}
          invertAxis
        />

        <VictoryAxis
          dependentAxis
          tickValues={[90, 140]}
          orientation="right"
          style={{
            grid: {stroke: colors.grey2, strokeDasharray: 8},
            axis: {stroke: colors.grey3, strokeWidth: 0},
            ticks: {opacity: 0},
          }}
        />
        <VictoryLine
          data={bps.map((bp, index) => {
            return {
              x: index + 1,
              y: bp.diastolic,
              label: `${bp.systolic}/${bp.diastolic}`,
            }
          })}
          style={{
            data: {
              stroke: colors.green1,
            },
          }}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryLine
          data={bps.map((bp, index) => {
            return {
              x: index + 1,
              y: bp.systolic,
              label: `${bp.systolic}/${bp.diastolic}`,
            }
          })}
          style={{
            data: {
              stroke: colors.green1,
            },
          }}
          labelComponent={<VictoryTooltip />}
        />

        <VictoryLine
          data={bps.map((bp, index) => {
            const previousBp = bps[index - 1]
            if (
              (previousBp && isBloodPressureHigh(previousBp)) ||
              isBloodPressureHigh(bp)
            ) {
              return {
                x: index + 1,
                y: bp.diastolic,
                label: `${bp.systolic}/${bp.diastolic}`,
              }
            }
            return null
          })}
          style={{
            data: {
              stroke: colors.red1,
            },
          }}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryLine
          data={bps.map((bp, index) => {
            const previousBp = bps[index - 1]
            if (
              (previousBp && isBloodPressureHigh(previousBp)) ||
              isBloodPressureHigh(bp)
            ) {
              return {
                x: index + 1,
                y: bp.systolic,
                label: `${bp.systolic}/${bp.diastolic}`,
              }
            }
            return null
          })}
          style={{
            data: {
              stroke: colors.red1,
            },
          }}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryScatter
          data={highBps.map((bp) => {
            return {
              x: bp.index + 1,
              y: bp.diastolic,
              label: `${bp.systolic}/${bp.diastolic}`,
            }
          })}
          size={5}
          style={{
            data: {fill: colors.white100, stroke: colors.red1, strokeWidth: 3},
          }}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryScatter
          data={highBps.map((bp) => {
            return {
              x: bp.index + 1,
              y: bp.systolic,
              label: `${bp.systolic}/${bp.diastolic}`,
            }
          })}
          size={5}
          style={{
            data: {fill: colors.white100, stroke: colors.red1, strokeWidth: 3},
          }}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryScatter
          data={lowBps.map((bp) => {
            return {
              x: bp.index + 1,
              y: bp.diastolic,
              label: `${bp.systolic}/${bp.diastolic}`,
            }
          })}
          size={5}
          style={{
            data: {
              fill: colors.white100,
              stroke: colors.green1,
              strokeWidth: 3,
            },
          }}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryScatter
          data={lowBps.map((bp) => {
            return {
              x: bp.index + 1,
              y: bp.systolic,
              label: `${bp.systolic}/${bp.diastolic}`,
            }
          })}
          size={5}
          style={{
            data: {
              fill: colors.white100,
              stroke: colors.green1,
              strokeWidth: 3,
            },
          }}
          labelComponent={<VictoryTooltip />}
        />
      </VictoryChart>
    </View>
  )
}
