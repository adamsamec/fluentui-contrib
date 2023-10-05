import * as React from 'react';
import { categories } from './AccessibleMeetBase';
import { CategorizedRecentMeetings, categoriesTitles } from './AccessibleMeetBase';

import {
  List,
  ListItemProps,
} from '@fluentui/react-northstar';
import {
  Tree,
  TreeItem,
  TreeItemLayout,
} from '@fluentui/react-components/unstable';
import {
  Button,
  SplitButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Toolbar,
  ToolbarButton,
} from '@fluentui/react-components';

interface IUpcomingMeetingsListRendererProps {
  threeUpcomingMeetingsItems: ListItemProps[];
  selectedUpcomingMeetingTitle: string | undefined;
}
export const UpcomingMeetingsListRenderer: React.FC<IUpcomingMeetingsListRendererProps> = ({
  threeUpcomingMeetingsItems,
  selectedUpcomingMeetingTitle,
 }) => {

  return (
    <>
      <List
        selectable
        items={threeUpcomingMeetingsItems}
        aria-label="Upcoming meetings"
      />

      <div role="group" aria-label={`${selectedUpcomingMeetingTitle} meeting options`}>
        <Button>View details</Button>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton>RSVP</MenuButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>Respond to occurrence</MenuItem>
              <MenuItem>Respond to series</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        <Button>Chat with participants</Button>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton>More options</MenuButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem>View meeting details</MenuItem>
              <MenuItem>Copy meeting link</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </>
  );
};

interface IRecentMeetingsTreeRendererrerProps {
  categorizedRecentMeetings: CategorizedRecentMeetings;
  selectedRecentMeetingTitle: string | undefined;
}
export const RecentMeetingsTreeRenderer: React.FC<IRecentMeetingsTreeRendererrerProps> = ({
  categorizedRecentMeetings,
  selectedRecentMeetingTitle,
 }) => {

  return (
    <>
      <Tree
        aria-label="All meetings"
        aria-describedby="lastMeetings-hint"
      >
        {categories.map(category => (
          <TreeItem itemType="branch">
            <TreeItemLayout>{categoriesTitles[category]}</TreeItemLayout>
            <Tree>
              {categorizedRecentMeetings[category].map(meeting => (
                <TreeItem itemType="leaf">
                  <TreeItemLayout onClick={() => alert(meeting.title)}>{meeting.recentTitle}</TreeItemLayout>
                </TreeItem>
              ))}
            </Tree>
          </TreeItem>
        ))}
      </Tree>

      <div role="group" aria-label={`${selectedRecentMeetingTitle} meeting options`}>
        <Button>Agenda and notes</Button>
        <Button>Chat with participants</Button>
        <Button>View recap</Button>
      </div>
    </>
  );
};
