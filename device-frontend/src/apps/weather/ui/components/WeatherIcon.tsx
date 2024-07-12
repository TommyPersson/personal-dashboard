import React from "react"

export const WeatherIcon = (props: { iconName: string, className: string }) => {
  const src = formatIconUrl(props.iconName)
  return <img className={props.className} src={src} alt={""} />
}

export function formatIconUrl(iconName: string): string {
  return `/assets/apps/weather/icons/${iconName}@4x.png`
}