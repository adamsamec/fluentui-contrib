import * as React from 'react';
import { categories, categoriesTitles, UpcomingMeetings, RecentMeetings } from './AccessibleMeetBase';

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableCellActions,
  TableCellLayout,
  useTableCompositeNavigation,
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
export const UpcomingMeetingsGridRenderer: React.FC<IUpcomingMeetingsListRendererProps> = ({ threeUpcomingMeetings }) => {
  const { tableRowTabsterAttribute, tableTabsterAttribute, onTableKeyDown } = useTableCompositeNavigation();

  const threeUpcomingMeetingsItems = React.useMemo(() => (
    threeUpcomingMeetings.map(meeting => (
      {
        title: meeting.titleWithDateAndTime,
      }
    ))), [threeUpcomingMeetings]);

  return (
    <Table
    role="grid"
    noNativeElements
    onKeyDown={onTableKeyDown}
    aria-label="Upcoming meetings"
    {...tableTabsterAttribute}
    >
      <TableBody>
        {threeUpcomingMeetingsItems.map((meeting, index) => (
          <TableRow
          key={index}
          tabIndex={0}
          {...tableRowTabsterAttribute}
          >
            <TableCell role="gridcell" tabIndex={0}>{meeting.title}</TableCell>
            <TableCell role="gridcell"><Button>View details</Button></TableCell>
            <TableCell role="gridcell">
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
            </TableCell>
            <TableCell role="gridcell"><Button>Chat with participants</Button></TableCell>
            <TableCell role="gridcell">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface IRecentMeetingsTreeRendererrerProps {
  recentMeetings: RecentMeetings;
}
export const RecentMeetingsTreeGridRenderer: React.FC<IRecentMeetingsTreeRendererrerProps> = ({ recentMeetings }) => {
  const { tableRowTabsterAttribute, tableTabsterAttribute, onTableKeyDown } = useTableCompositeNavigation();

  return (
      <Table
      role="grid"
      noNativeElements
      onKeyDown={onTableKeyDown}
        aria-label="All meetings"
        aria-describedby="lastMeetings-hint"
        {...tableTabsterAttribute}
      >
        <TableBody>
          {categories.map((category, categoryIndex) => (
            <>
              <TableRow
              key={categoryIndex}
              tabIndex={0}
              {...tableRowTabsterAttribute}
              >
                <TableCell role="gridcell" tabIndex={0} colSpan={4}>{categoriesTitles[category]}</TableCell>
              </TableRow>
              {recentMeetings[category].map((meeting, meetingIndex) => (
                <TableRow
                key={meetingIndex}
                tabIndex={0}
                {...tableRowTabsterAttribute}
                >
                  <TableCell role="gridcell" tabIndex={0}>{meeting.titleWithTime}</TableCell>
                  <TableCell role="gridcell">        <Button>Agenda and notes</Button></TableCell>
                  <TableCell role="gridcell"><Button>Chat with participants</Button></TableCell>
                  <TableCell role="gridcell"><Button>View recap</Button></TableCell>
                </TableRow>
              ))}

            </>
          ))}
        </TableBody>
      </Table>
  );
};
