import * as React from 'react';
import { Button, List, ListItem } from '@fluentui/react-components';

import { participantsList } from './participantsList';

export const ParticipantsGroupedGridList = () => {
  return (
    <List role="presentation" navigationMode="composite">
      <div>People</div>
      <div role="grid" aria-label="People">
        {participantsList.people.map((name, index) => (
          <ListItem key={index} role="row" aria-label={name}>
            <div role="gridcell">{name}</div>
            <div role="gridcell">
              <Button aria-description={`Show profile card for ${name}`}>
                Avatar for {name}
              </Button>
            </div>
            <div role="gridcell">
              <Button>Remove {name}</Button>
            </div>
          </ListItem>
        ))}
      </div>
      <div>Agents and bots</div>
      <div role="grid" aria-label="Agents and bots">
        {participantsList.agentsAndBots.map((name, index) => (
          <ListItem key={index} role="row" aria-label={name}>
            <div role="gridcell">{name}</div>
            <div role="gridcell">
              <Button aria-description={`Show profile card for ${name}`}>
                Avatar for {name}
              </Button>
            </div>
            <div role="gridcell">
              <Button>Remove {name}</Button>
            </div>
          </ListItem>
        ))}
      </div>
    </List>
  );
};
