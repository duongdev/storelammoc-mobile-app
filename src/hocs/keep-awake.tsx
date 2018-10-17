import * as React from 'react'

import { KeepAwake } from 'expo'

export interface KeepAwakeProps {}

/**
 * Keeps `WrappedComponent` awakes while being mounted
 * @param WrappedComponent
 * @example keepAwake(SomeComponent)
 */
const keepAwake = ($keepAwake: boolean = false) => <P extends object>(
  WrappedComponent: React.ComponentType<P & KeepAwakeProps>,
): React.SFC<P & KeepAwakeProps> => (props: P) => {
  const keepAwake = $keepAwake || __DEV__

  return (
    <React.Fragment>
      {keepAwake && <KeepAwake />}
      <WrappedComponent {...props} />
    </React.Fragment>
  )
}

export default keepAwake
