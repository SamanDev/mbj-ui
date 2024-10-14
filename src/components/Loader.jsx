import React from 'react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const LoaderExampleLoader = () => (
  <Segment basic className="myloading">
    <Dimmer active>
      <Loader  size='huge' />
    </Dimmer>

  </Segment>
)

export default LoaderExampleLoader