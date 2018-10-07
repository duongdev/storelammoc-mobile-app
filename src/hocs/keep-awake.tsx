import * as React from 'react'

import { KeepAwake } from 'expo'

export interface KeepAwakeProps {
  keepAwake: boolean
}

const keepAwake = <P extends object>(
  WrappedComponent: React.ComponentType<P & KeepAwakeProps>,
) => (props: P & KeepAwakeProps) => (
  <React.Fragment>
    <KeepAwake />
    <WrappedComponent keepAwake {...props} />
  </React.Fragment>
)

export default keepAwake
