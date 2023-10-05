import * as React from 'react';
import { UpcomingMeetingsGridRenderer, RecentMeetingsTreeGridRenderer } from './AccessibleMeetGridsRenderer';
import { UpcomingMeetingsListRenderer, RecentMeetingsTreeListRenderer } from './AccessibleMeetListsRenderer';

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
const nowDate = new Date('2023-10-01 12:30');

export const categories: string[] = [];
export const categoriesTitles: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  lastWeek: 'Last week',
};

const meetings = [
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

export type UpcomingMeetings = {
  title: string;
  titleWithDateAndTime: string;
}[];

export type RecentMeetings = Record<string, {
  title: string;
  titleWithTime: string;
  properties?: string[];
}[]>;

const getFormattedTime = (date: Date) => {
  let hours = date.getHours();
  let minutes = (date.getMinutes()).toString();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = (hours === 0) ? 12 : hours; // The hour 0 should be 12
  minutes = minutes.padStart(2, '0');
  const time = `${hours}:${minutes} ${ampm}`;
  return time;
};

interface IAccessibleMeetBaseProps {
  variant: string;
}
export const AccessibleMeetBase: React.FC<IAccessibleMeetBaseProps> = ({ variant }) => {
  const threeUpcomingMeetings = React.useMemo(() => {
    let upcomingMeetings = meetings.filter(meeting => {
      const meetingEndDate = new Date(meeting.endDate);
      return meetingEndDate > nowDate;
    });
    upcomingMeetings = upcomingMeetings.slice(-3, 3);

    return upcomingMeetings.map(meeting => {
      const meetingStartDate = new Date(meeting.startDate);
      const meetingEndDate = new Date(meeting.endDate);
      const dayOfWeekOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
      const monthOptions: Intl.DateTimeFormatOptions = { month: 'long' };
      const dayOfWeek = new Intl.DateTimeFormat(dateLocale, dayOfWeekOptions).format(meetingStartDate);
      const month = new Intl.DateTimeFormat(dateLocale, monthOptions).format(meetingStartDate);
      const dayOfMonth = meetingStartDate.getDate();
      const year = meetingStartDate.getFullYear();
      const startTime = getFormattedTime(meetingStartDate);
      const endTime = getFormattedTime(meetingEndDate);
      const titleWithDateAndTime = `${meeting.title}, ${dayOfWeek}, ${month} ${dayOfMonth}, ${year}, ${startTime} to ${endTime}`;
      return {
        title: meeting.title,
        titleWithDateAndTime,
      };
    });
  }, []);

  const recentMeetings = React.useMemo(() => {
    const result: RecentMeetings = {
      today: [],
      yesterday: [],
      lastWeek: [],
    };
    meetings.forEach(meeting => {
      const meetingStartDate = new Date(meeting.startDate);
      const meetingEndDate = new Date(meeting.endDate);
      const meetingEndDateStr = meetingEndDate.toISOString().split('T')[0];
      const todayStartDateStr = nowDate.toISOString().split('T')[0];
      const isTodayUntilNow = (meetingEndDate < nowDate) && (meetingEndDateStr === todayStartDateStr);
      const yesterdayStartDate = new Date(todayStartDateStr);
      yesterdayStartDate.setDate(yesterdayStartDate.getDate() - 1);
      const beforeWeekStartDate = new Date(nowDate);
      beforeWeekStartDate.setDate(nowDate.getDate() - 7);
      const startTime = getFormattedTime(meetingStartDate);
      const endTime = getFormattedTime(meetingEndDate);

      // Create the upcoming meeting
      const upcomingMeeting = {
        ...meeting,
        titleWithTime: `${meeting.title}, ${startTime} to ${endTime}`,
      };

      // Categorize the upcoming meeting
      if (isTodayUntilNow) {
        result.today.push(upcomingMeeting);
      } else if ((meetingEndDate < nowDate) && (meetingEndDate >= yesterdayStartDate)) {
        result.yesterday.push(upcomingMeeting);
      } else if ((meetingEndDate < nowDate) && (meetingEndDate >= beforeWeekStartDate)) {
        result.lastWeek.push(upcomingMeeting);
      } else if (meetingEndDate < nowDate) {
        const dayOfWeekOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const monthOptions: Intl.DateTimeFormatOptions = { month: 'long' };
        const dayOfWeek = new Intl.DateTimeFormat(dateLocale, dayOfWeekOptions).format(meetingStartDate);
        const dayOfMonth = meetingStartDate.getDate();
        const month = new Intl.DateTimeFormat(dateLocale, monthOptions).format(meetingStartDate);
        const categoryTitle = `${dayOfWeek}, ${month} ${dayOfMonth}`;
        if (meetingEndDateStr in result) {
          result[meetingEndDateStr].push(upcomingMeeting);
        } else {
          categories.push(meetingEndDateStr);
          categoriesTitles[meetingEndDateStr] = categoryTitle;
          result[meetingEndDateStr] = [upcomingMeeting];
        }
      }
    });

    // Insert non-date category identifiers into the categories list in a right order if they contain at least one meeting
    ['lastWeek', 'yesterday', 'today'].forEach(category => {
      if (result[category].length > 0) {
        categories.unshift(category);
      }
    });
    
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
        <Button disabledFocusable={true}>Previous meetings</Button>
        <Button>Next meetings</Button>

        {variant === 'grids' && (
          <UpcomingMeetingsGridRenderer threeUpcomingMeetings={threeUpcomingMeetings} />
        )}
        {variant === 'lists' && (
          <UpcomingMeetingsListRenderer threeUpcomingMeetings={threeUpcomingMeetings} />
        )}

        <h2>Recent</h2>
        <div id="lastMeetings-hint" style={{ display: 'none' }}>Includes all your meetings in the last 30 days.</div>

        {variant === 'grids' && (
        <RecentMeetingsTreeGridRenderer recentMeetings={recentMeetings} />
        )}
        {variant === 'lists' && (
        <RecentMeetingsTreeListRenderer recentMeetings={recentMeetings} />
        )}
      </div>
    </>
  );
};
