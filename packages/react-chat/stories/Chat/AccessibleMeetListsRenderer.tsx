import * as React from 'react';
import { categories, categoriesTitles, UpcomingMeetings, RecentMeetings } from './AccessibleMeetBase';

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
  threeUpcomingMeetings: UpcomingMeetings;
}
export const UpcomingMeetingsListRenderer: React.FC<IUpcomingMeetingsListRendererProps> = ({ threeUpcomingMeetings }) => {
  const [selectedUpcomingMeetingTitle, setSelectedUpcomingMeetingTitle] = React.useState<string | undefined>();

  const threeUpcomingMeetingsItems = React.useMemo(() => (
    threeUpcomingMeetings.map((meeting, index) => (
      {
    key: index,
    content: meeting.titleWithDateAndTime,
    onFocus: () => {
      setSelectedUpcomingMeetingTitle(meeting.title);
    },
  }
  ))), [threeUpcomingMeetings, setSelectedUpcomingMeetingTitle]);

  React.useEffect(() => {
    setSelectedUpcomingMeetingTitle(threeUpcomingMeetings[0].title);
  }, [threeUpcomingMeetings, setSelectedUpcomingMeetingTitle]);

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
  recentMeetings: RecentMeetings;
}
export const RecentMeetingsTreeListRenderer: React.FC<IRecentMeetingsTreeRendererrerProps> = ({ recentMeetings }) => {
  const [selectedRecentMeetingTitle, setSelectedRecentMeetingTitle] = React.useState<string | undefined>();

  React.useEffect(() => {
    const firstCategoryWithMeetings = categories.find(category => {
      return recentMeetings[category].length > 0;
    }) as string;
    const title = recentMeetings[firstCategoryWithMeetings][0].title;
    setSelectedRecentMeetingTitle(title);
  }, [recentMeetings, setSelectedRecentMeetingTitle]);

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
              {recentMeetings[category].map(meeting => (
                <TreeItem itemType="leaf">
                  <TreeItemLayout onClick={() => alert(meeting.title)}>{meeting.titleWithTime}</TreeItemLayout>
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
