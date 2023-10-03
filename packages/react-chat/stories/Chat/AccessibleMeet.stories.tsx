import * as React from 'react';
import {
  List,
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
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Toolbar,
  ToolbarButton,
} from '@fluentui/react-components';

const dateLocale = 'en-US';
const todayDate = new Date('2023-10-01 12:30');

const categories: string[] = [];
const categoriesTitles: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  lastWeek: 'Last week',
};

type Meeting = {
  title: string;
  date: string;
  properties: string[];
};
const meetings: Meeting[] = [
  {
    title: 'Weekly summary #3',
    date: '2023-10-06 14:30',
    properties: ['includingContent', 'recorded'],
  },
  {
    title: 'Monthly townhall',
    date: '2023-10-01 11:00',
    properties: ['includingContent', 'recorded', 'mentionsOfYou'],
  },
  {
    title: 'Weekly summary #2',
    date: '2023-09-29 14:30',
    properties: ['includingContent', 'recorded'],
  },
  {
    title: 'Meeting with John',
    date: '2023-09-28 10:15',
    properties: ['includingContent', 'missed', 'withYou'],
  },
  {
    title: 'Weekly summary #1',
    date: '2023-09-22 14:30',
    properties: ['includingContent', 'missed', 'recorded', 'mentionsOfYou'],
  },
];

export const AccessibleMeet: React.FC = () => {
  const threeUpcomingMeetingsTitles = React.useMemo(() => {
    const upcomingMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate > todayDate;
    }).map(meeting => meeting.title);
    return upcomingMeetings.slice(0, 3);
  }, []);

  const categorizedMeetings = React.useMemo(() => {
    const result: Record<string, Meeting[]> = {
      today: [],
      yesterday: [],
      lastWeek: [],
    };
    meetings.forEach(meeting => {
      const meetingDate = new Date(meeting.date);
      const meetingDateStr = meetingDate.toISOString().split('T')[0];
      const todayDateStr = todayDate.toISOString().split('T')[0];
      const isToday = (meetingDate < todayDate) && (meetingDateStr === todayDateStr);
      const yesterdayDate = new Date(todayDateStr);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const beforeWeekDate = new Date(todayDate);
      beforeWeekDate.setDate(todayDate.getDate() - 7);
      if (isToday) {
        result.today.push(meeting);
      } else if ((meetingDate < todayDate) && (meetingDate >= yesterdayDate)) {
        result.yesterday.push(meeting);
      } else if ((meetingDate < todayDate) && (meetingDate >= beforeWeekDate)) {
        result.lastWeek.push(meeting);
      } else if (meetingDate < todayDate) {
        const dayOfWeekOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const monthOptions: Intl.DateTimeFormatOptions = { month: 'long' };
        const dayOfWeek = new Intl.DateTimeFormat(dateLocale, dayOfWeekOptions).format(meetingDate);
        const dayOfMonth = meetingDate.getDate();
        const month = new Intl.DateTimeFormat(dateLocale, monthOptions).format(meetingDate);
        const categoryTitle = `${dayOfWeek}, ${month} ${dayOfMonth}`;
        if (meetingDateStr in result) {
          result[meetingDateStr].push(meeting);
        } else {
          categories.push(meetingDateStr);
          categoriesTitles[meetingDateStr] = categoryTitle;
          result[meetingDateStr] = [meeting];
        }
      }
    });
    if (result.lastWeek.length > 0) {
      categories.unshift('lastWeek');
    }
    if (result.yesterday.length > 0) {
      categories.unshift('yesterday');
    }
    if (result.today.length > 0) {
      categories.unshift('today');
    }
    return result;
  }, []);

  return (
    <>
      <h1>Accessible Meet</h1>
      <div role="application">

        <Toolbar>
          <ToolbarButton>Join with an ID</ToolbarButton>
          <ToolbarButton>Meet now</ToolbarButton>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              {triggerProps => (
                <SplitButton
                  menuButton={{ ...triggerProps, 'aria-label': 'Schedule a different type meeting' }}
                >
                  Schedule a new meeting
                </SplitButton>
              )}
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem>Schedule meeting</MenuItem>
                <MenuItem>Webinar Host interactive event with registration</MenuItem>
                <MenuItem>Town hall Produce event for large audience</MenuItem>
                <MenuItem>Virtual appointment Guests join on web and enter via tailored lobby</MenuItem>
                <MenuItem>Controlled-content meeting Apply extra meeting content controls</MenuItem>
                <MenuItem>Live event Produce live event</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </Toolbar>

        <h2>Up next</h2>
        <Button>Open my calendar</Button>
        <Button disabledFocusable={true} aria-describedby="lastMeetings-hint">Previous meetings</Button>
        <Button aria-describedby="lastMeetings-hint">Next meetings</Button>
        <div id="lastMeetings-hint" style={{ display: 'none' }}>Includes all your meetings in the last 30 days.</div>

        <List
          selectable
          items={threeUpcomingMeetingsTitles}
          aria-label="Upcoming meetings"
        />

        <h2>Recent</h2>
        <Tree aria-label="All meetings">
          {categories.map(category => (
            <TreeItem itemType="branch">
              <TreeItemLayout>{categoriesTitles[category]}</TreeItemLayout>
              <Tree>
                {categorizedMeetings[category].map(meeting => (
                  <TreeItem itemType="leaf">
                    <TreeItemLayout>{meeting.title}</TreeItemLayout>
                  </TreeItem>
                ))}
              </Tree>
            </TreeItem>
          ))}
          </Tree>

    </div>
    </>
  );
};
