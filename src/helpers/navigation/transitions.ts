import { NavigationTransitionProps } from 'react-navigation'

const fadeInLeft = (transitionProps: NavigationTransitionProps) => {
  const { scene, layout, position } = transitionProps
  const { index } = scene
  const { initWidth } = layout

  const translateX = position.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [initWidth, 0, initWidth * -0.3],
  })
  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index],
    outputRange: [0, 1, 1],
  })

  return { opacity, transform: [{ translateX }] }
}

const fadeInTop = (transitionProps: NavigationTransitionProps) => {
  const { scene, layout, position } = transitionProps
  const { index } = scene

  const height = layout.initHeight

  const translateY = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [height, 0],
  })

  const opacity = position.interpolate({
    inputRange: [index - 1, index - 0.99, index],
    outputRange: [0, 1, 1],
  })

  return { opacity, transform: [{ translateY }] }
}

const fadeIn = (transitionProps: NavigationTransitionProps) => {
  const { scene, position } = transitionProps
  const { index } = scene

  const opacity = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [0, 1],
  })

  return { opacity }
}

const zoomIn = (transitionProps: NavigationTransitionProps) => {
  const { scene, position } = transitionProps
  const { index } = scene

  const scale = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [0, 1],
  })

  return { transform: [{ scale }] }
}

const zoomOut = (transitionProps: NavigationTransitionProps) => {
  const { scene, position } = transitionProps
  const { index } = scene

  const scale = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [10, 1],
  })

  return { transform: [{ scale }] }
}

const flipY = (transitionProps: NavigationTransitionProps) => {
  const { scene, position } = transitionProps
  const { index } = scene

  const rotateY = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: ['180deg', '0deg'],
  })

  return { transform: [{ rotateY }], backfaceVisibility: 'hidden' }
}

const flipX = (transitionProps: NavigationTransitionProps) => {
  const { scene, position } = transitionProps
  const { index } = scene

  const rotateX = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: ['180deg', '0deg'],
  })

  return { transform: [{ rotateX }], backfaceVisibility: 'hidden' }
}

const navigationTransitions = {
  fadeInLeft,
  fadeInTop,
  fadeIn,
  zoomIn,
  zoomOut,
  flipX,
  flipY,
}

export default navigationTransitions
