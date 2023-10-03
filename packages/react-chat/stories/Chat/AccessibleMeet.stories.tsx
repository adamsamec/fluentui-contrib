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
  MenuButton,
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
  upcomingTitle?: string;
  recentTitle?: string;
  startDate: string;
  endDate: string;
  properties?: string[];
};
const meetings: Meeting[] = [
  {
    title: 'Weekly summary #3',
    startDate: '2023-10-06 14:30',
    endDate: '2023-10-06 15:30',
  },
  {
    title: 'Meeting with manager',
    startDate: '2023-10-03 8:00',
    endDate: '2023-10-03 9:00',
  },
  {
    title: 'Monthly townhall',
    startDate: '2023-10-01 10:00',
    endDate: '2023-10-01 11:00',
    properties: ['includingContent', 'recorded', 'mentionsOfYou'],
  },
  {
    title: 'Weekly summary #2',
    startDate: '2023-09-29 14:30',
    endDate: '2023-09-29 15:30',
    properties: ['includingContent', 'recorded'],
  },
  {
    title: 'Meeting with John',
    startDate: '2023-09-28 10:15',
    endDate: '2023-09-28 11:15',
    properties: ['includingContent', 'missed', 'withYou'],
  },
  {
    title: 'Weekly summary #1',
    startDate: '2023-09-22 14:30',
    endDate: '2023-09-22 15:30',
    properties: ['includingContent', 'missed', 'recorded', 'mentionsOfYou'],
  },
];

const getFormattedTime = (date: Date) => {
  let hours = date.getHours();
  let minutes = (date.getMinutes()).toString();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = (hours === 0) ? 12 : hours; // The hour 0 should be 12
  minutes = minutes.padStart(2, '0');
  const time = `${hours}:${minutes} ${ampm}`;
  return time;
}

export const AccessibleMeet: React.FC = () => {
const [selectedUpcomingMeetingTitle, setSelectedUpcomingMeetingTitle] = React.useState<string | undefined>();
const [selectedRecentMeetingTitle, setSelectedRecentMeetingTitle] = React.useState<string | undefined>();

  const threeUpcomingMeetingsItems = React.useMemo(() => {
    let upcomingMeetings = meetings.filter(meeting => {
      const meetingEndDate = new Date(meeting.endDate);
      return meetingEndDate > todayDate;
    });
    upcomingMeetings = upcomingMeetings.slice(-3, 3);

    return upcomingMeetings.map((meeting, index) => {
      const meetingStartDate= new Date(meeting.startDate);
      const meetingEndDate= new Date(meeting.endDate);
      const dayOfWeekOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const monthOptions: Intl.DateTimeFormatOptions = { month: 'long' };
      const dayOfWeek = new Intl.DateTimeFormat(dateLocale, dayOfWeekOptions).format(meetingStartDate);
      const month = new Intl.DateTimeFormat(dateLocale, monthOptions).format(meetingStartDate);
      const dayOfMonth = meetingStartDate.getDate();
      const year = meetingStartDate.getFullYear();
      const startTime = getFormattedTime(meetingStartDate);
      const endTime = getFormattedTime(meetingEndDate);
      const upcomingTitle = `${meeting.title}, ${dayOfWeek}, ${month} ${dayOfMonth}, ${year}, ${startTime} to ${endTime}`;
      return {
        key: index,
        title: meeting.title,
        content: upcomingTitle,
        onFocus: () => {
          setSelectedUpcomingMeetingTitle(meeting.title);
      },
    };
    });
  }, [setSelectedUpcomingMeetingTitle]);

  React.useEffect(() => {
    setSelectedUpcomingMeetingTitle(threeUpcomingMeetingsItems[0].title);
  }, [threeUpcomingMeetingsItems, setSelectedUpcomingMeetingTitle]);

  const categorizedMeetings = React.useMemo(() => {
    const result: Record<string, Meeting[]> = {
      today: [],
      yesterday: [],
      lastWeek: [],
    };
    meetings.forEach(meeting => {
      const meetingStartDate = new Date(meeting.startDate);
      const meetingEndDate = new Date(meeting.endDate);
      const meetingEndDateStr = meetingEndDate.toISOString().split('T')[0];
      const todayStartDateStr = todayDate.toISOString().split('T')[0];
      const isTodayUntilNow = (meetingEndDate < todayDate) && (meetingEndDateStr === todayStartDateStr);
      const yesterdayStartDate = new Date(todayStartDateStr);
      yesterdayStartDate.setDate(yesterdayStartDate.getDate() - 1);
      const beforeWeekStartDate = new Date(todayDate);
      beforeWeekStartDate.setDate(todayDate.getDate() - 7);

      // Add title extended with meeting start and end times
      const startTime = getFormattedTime(meetingStartDate);
      const endTime = getFormattedTime(meetingEndDate);
meeting.recentTitle = `${meeting.title}, ${startTime} to ${endTime}`;;

// Categorize meetings
      if (isTodayUntilNow) {
        result.today.push(meeting);
      } else if ((meetingEndDate < todayDate) && (meetingEndDate >= yesterdayStartDate)) {
        result.yesterday.push(meeting);
      } else if ((meetingEndDate < todayDate) && (meetingEndDate >= beforeWeekStartDate)) {
        result.lastWeek.push(meeting);
      } else if (meetingEndDate < todayDate) {
        const dayOfWeekOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const monthOptions: Intl.DateTimeFormatOptions = { month: 'long' };
        const dayOfWeek = new Intl.DateTimeFormat(dateLocale, dayOfWeekOptions).format(meetingStartDate);
        const dayOfMonth = meetingStartDate.getDate();
        const month = new Intl.DateTimeFormat(dateLocale, monthOptions).format(meetingStartDate);
        const categoryTitle = `${dayOfWeek}, ${month} ${dayOfMonth}`;
        if (meetingEndDateStr in result) {
          result[meetingEndDateStr].push(meeting);
        } else {
          categories.push(meetingEndDateStr);
          categoriesTitles[meetingEndDateStr] = categoryTitle;
          result[meetingEndDateStr] = [meeting];
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

  React.useEffect(() => {
    const firstCategoryWithMeetings = categories.find(category => {
return categorizedMeetings[category].length > 0;
    }) as string;
    const title = categorizedMeetings[firstCategoryWithMeetings][0].title;
    setSelectedRecentMeetingTitle(title);
  }, [setSelectedRecentMeetingTitle, categorizedMeetings]);

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
        <Button disabledFocusable={true}>Previous meetings</Button>
        <Button>Next meetings</Button>

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

        <h2>Recent</h2>
        <div id="lastMeetings-hint" style={{ display: 'none' }}>Includes all your meetings in the last 30 days.</div>
        <Tree
        aria-label="All meetings"
        aria-describedby="lastMeetings-hint"
        >
          {categories.map(category => (
            <TreeItem itemType="branch">
              <TreeItemLayout>{categoriesTitles[category]}</TreeItemLayout>
              <Tree>
                {categorizedMeetings[category].map(meeting => (
                  <TreeItem itemType="leaf">
                    <TreeItemLayout>{meeting.recentTitle}</TreeItemLayout>
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
    </div>
    </>
  );
};
