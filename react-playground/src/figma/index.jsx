import React from 'react'
import OneWayResource from "./oneWayResource"
import useDeviceDeviceDetection from '../hooks/useDeviceDetection'

function useDeviceType() {
  const userAgent = window.navigator.userAgent;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);


  return { isMobile };
}

const Figma = () => {
  const device = useDeviceType();

  return (
    <OneWayResource />
  )
}

export default Figma