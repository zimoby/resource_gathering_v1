import { useEffect, useState } from "react"

import "./styles.css"

const backgroundSliderCalc = (value: number, minVal: number, maxVal: number): string => {
  const percent = maxVal === minVal ? 100 : ((value - minVal) / (maxVal - minVal)) * 100
  return `linear-gradient(to right, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) ${percent}%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)`
}

type SliderWithInputProps = {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onUpdate: (value: number) => void
}

type CheckBoxProps = {
  label: string
  value: boolean
  onUpdate: (value: boolean) => void
}

export const CheckBox = ({ label, value, onUpdate }: CheckBoxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.checked)
  }

  return (
    <div className="relative flex flex-row text-xs justify-start items-center">
      <div className="relative w-32 truncate select-none">{label}</div>
      <input
        type="checkbox"
        checked={value}
        onChange={handleChange}
        className="h-4 w-4 cursor-pointer appearance-none rounded-sm"
        style={{
          background: value ? "rgba(128, 0, 128, 0.7)" : "rgba(255, 255, 255, 0.1)",
        }}
      />
      {value ? (
        <div
          className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-white"
          style={{ zIndex: 1, pointerEvents: "none" }}
        />
      ) : null
      }
    </div>
  )
}

export const SliderWithInput = ({ label, value, min = 1, max = 100, step = 1, onUpdate }: SliderWithInputProps) => {
  const [localValue, setLocalValue] = useState<number>(value)

  const allChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(Number(e.target.value))
    onUpdate(Number(e.target.value))
  }

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <div className="relative flex flex-row text-xs justify-center items-center">
      <div className="relative w-32 truncate select-none">{label}</div>
      <input
        className="h-2 w-24 cursor-pointer appearance-none rounded-sm"
        style={{
          background: backgroundSliderCalc(localValue, min, max),
        }}
        type="range"
        min={min}
        max={max}
        value={localValue}
        step={step}
        onChange={allChange}
        // onMouseUp={handleMouseUp}
      />
      <input
        className="h-hull ml-2 m-0 w-10 rounded-sm border-transparent bg-black/20 p-0 text-center text-xs text-white"
        min={min.toString()}
        max={max.toString()}
        step={step.toString()}
        type="number"
        value={localValue}
        onChange={allChange}
      />
    </div>
  )
}
