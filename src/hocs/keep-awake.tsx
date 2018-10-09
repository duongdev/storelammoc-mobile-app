import * as React from 'react'

import { KeepAwake } from 'expo'

export interface KeepAwakeProps {
  keepAwake: boolean
}
/**
 * Keeps `WrappedComponent` awakes while being mounted
 * @param WrappedComponent
 * @example keepAwake(SomeComponent)
 */
const keepAwake = <P extends object>(
  WrappedComponent: React.ComponentType<P & KeepAwakeProps>,
): React.SFC<P & KeepAwakeProps> => (props: KeepAwakeProps) => (
  <React.Fragment>
    <KeepAwake />
    <WrappedComponent keepAwake {...props} />
  </React.Fragment>
)

export default keepAwake
