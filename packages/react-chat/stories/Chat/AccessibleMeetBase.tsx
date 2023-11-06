import * as React from 'react';
import { RecentMeetingsStitchedTreeGridRowNavigationRenderer } from './AccessibleMeetStitchedGridsRowNavigationRenderer';
import { UpcomingMeetingsGridRowNavigationRenderer, RecentMeetingsTreeGridRowNavigationRenderer } from './AccessibleMeetGridsRowNavigationRenderer';
import { UpcomingMeetingsGridCellNavigationRenderer, RecentMeetingsTreeGridCellNavigationRenderer } from './AccessibleMeetGridsCellNavigationRenderer';
import { UpcomingMeetingsListRenderer, RecentMeetingsTreeListRenderer } from './AccessibleMeetListsRenderer';

import {
  Checkbox,
  CheckboxOnChangeData,
  Divider,
  Button,
  SplitButton,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Toolbar,
  ToolbarButton,
  TabList,
  Tab,
  Field,
  Input,
} from '@fluentui/react-components';

export const categoriesTitles: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  lastWeek: 'Last week',
};

const dateLocale = 'en-US';
const nowDate = new Date('2023-10-01 12:30');

const meetings = [

  // Upcoming meetings
  {
    title: 'Weekly summary #3',
    startDate: '2023-10-06 14:30',
    endDate: '2023-10-06 15:30',
  },
  {
    title: 'Mandatory  training #2',
    startDate: '2023-10-03 14:30',
    endDate: '2023-10-03 15:30',
  },
  {
    title: 'Meeting with manager',
    startDate: '2023-10-03 8:00',
    endDate: '2023-10-03 9:00',
  },

  // Recent meetings
  {
    title: 'Monthly townhall',
    startDate: '2023-10-01 10:00',
    endDate: '2023-10-01 11:00',
    properties: ['includingContent', 'recorded', 'mentionsOfYou'],
  },
  {
    title: 'Planning for next quarter',
    startDate: '2023-10-01 11:00',
    endDate: '2023-10-01 12:00',
    properties: ['recorded'],
  },
  {
    title: 'Weekly summary #2',
    startDate: '2023-09-29 14:30',
    endDate: '2023-09-29 15:30',
    properties: ['includingContent', 'recorded'],
    tasksCount: 4,
  },
  {
    title: 'Mandatory training #1',
    startDate: '2023-09-29 9:00',
    endDate: '2023-09-29 10:00',
    properties: ['includingContent', 'recorded', 'mentionsOfYou'],
  },
  {
    title: 'Meeting with John',
    startDate: '2023-09-28 10:15',
    endDate: '2023-09-28 11:15',
    properties: ['transcript', 'includingContent', 'missed'],
    tasksCount: 2,
  },
  {
    title: 'Weekly summary #1',
    startDate: '2023-09-22 14:30',
    endDate: '2023-09-22 15:30',
    properties: ['includingContent', 'missed', 'recorded', 'mentionsOfYou'],
  },
  {
    title: 'Meeting with Kate',
    startDate: '2023-09-22 13:30',
    endDate: '2023-09-22 14:15',
    properties: ['includingContent', 'transcript'],
  },
];

export type UpcomingMeeting = {
  title: string;
  titleWithDateAndTime: string;
};

export type RecentCategory = {
id: string;
title: string;
expanded:boolean;
columns:string[];
};

export type RecentMeetings = Record<string, {
  id: string;
  title: string;
  titleWithTime: string;
  properties?: string[];
  tasksCount?: number;
  revealed: boolean;
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
const [cellNavigationOnly, setCellNavigationOnly] = React.useState(false);
  const recentCategoriesRef = React.useRef<RecentCategory[]>([]);

  const handleCellNavigationOnlyChange = React.useCallback((event: React.ChangeEvent, data: CheckboxOnChangeData) => {
setCellNavigationOnly(!!data.checked);
  }, [setCellNavigationOnly]);

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
      'category-today': [],
      'category-yesterday': [],
      'category-lastWeek': [],
    };
    meetings.forEach((meeting, index) => {
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

      // Create the recent meeting
      const recentMeeting = {
        ...meeting,
        id: `recentMeeting${index}`,
        titleWithTime: `${meeting.title}, ${startTime} to ${endTime}`,
        revealed: true,
      };

      // Categorize the recent meeting
      if (isTodayUntilNow) {
        result['category-today'].push(recentMeeting);
      } else if ((meetingEndDate < nowDate) && (meetingEndDate >= yesterdayStartDate)) {
        result['category-yesterday'].push(recentMeeting);
      } else if ((meetingEndDate < nowDate) && (meetingEndDate >= beforeWeekStartDate)) {
        result['category-lastWeek'].push(recentMeeting);
      } else if (meetingEndDate < nowDate) {
        const dayOfWeekOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const monthOptions: Intl.DateTimeFormatOptions = { month: 'long' };
        const dayOfWeek = new Intl.DateTimeFormat(dateLocale, dayOfWeekOptions).format(meetingStartDate);
        const dayOfMonth = meetingStartDate.getDate();
        const month = new Intl.DateTimeFormat(dateLocale, monthOptions).format(meetingStartDate);
        const categoryTitle = `${dayOfWeek}, ${month} ${dayOfMonth}`;
        const categoryId = `category-${meetingEndDateStr}`;
        if (categoryId in result) {
          result[categoryId].push(recentMeeting);
        } else {
          recentCategoriesRef.current.push({
            id: categoryId,
            title: categoryTitle,
            expanded: false,
            columns: [],
          });
          result[categoryId] = [recentMeeting];
        }
      }
    });

    // Insert relative-date categories into the recentCategories list in a right order if they contain at least one meeting
    ['lastWeek', 'yesterday', 'today'].forEach(categoryName => {
      const categoryId = `category-${categoryName}`;
      if (result[categoryId].length > 0) {
        recentCategoriesRef.current.unshift({
          id: categoryId,
          title: categoriesTitles[categoryName],
          expanded: false,
          columns: [],
        });
      }
    });

    // Determine the number of columns for each category
    const excludedProperties = ['missed', 'recorded', 'mentionsOfYou'];
    recentCategoriesRef.current.forEach(category => {
result[category.id].forEach(meeting => {
  if (meeting.tasksCount && !category.columns.includes('tasks')) {
category.columns.push('tasks');
  }
  if (!meeting.properties) {
return
  }
  meeting.properties.forEach(property => {
if (!excludedProperties.includes(property) && !category.columns.includes(property)) {
category.columns.push(property);
}
  });
});
console.log(category.id + ' = ' + JSON.stringify(category.columns));
    });
    
    return result;
  }, [recentCategoriesRef]);

  return (
    <>
      <h1>Accessible Meet</h1>

      {variant === 'grids' && (
        <>
<Checkbox
checked={cellNavigationOnly}
onChange={handleCellNavigationOnlyChange}
label="Use cell-only navigation"
/>
<Divider />
</>
)}

      <div>

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

        {variant === 'stitchedGridsRowNavigation' && (
          <UpcomingMeetingsGridRowNavigationRenderer
          cellNavigationOnly={cellNavigationOnly}
          threeUpcomingMeetings={threeUpcomingMeetings}
          />
        )}

        {variant === 'gridsRowNavigation' && (
          <UpcomingMeetingsGridRowNavigationRenderer
          cellNavigationOnly={cellNavigationOnly}
          threeUpcomingMeetings={threeUpcomingMeetings}
          />
        )}

{variant === 'gridsCellNavigation' && (
          <UpcomingMeetingsGridCellNavigationRenderer
          cellNavigationOnly={cellNavigationOnly}
          threeUpcomingMeetings={threeUpcomingMeetings}
          />
        )}

        {variant === 'lists' && (
          <UpcomingMeetingsListRenderer threeUpcomingMeetings={threeUpcomingMeetings} />
        )}

        <h2>Recent</h2>
        <div id="lastMeetings-hint" style={{ display: 'none' }}>Includes all your meetings in the last 30 days.</div>

<TabList>
<Tab value="all">All Meetings</Tab>
<Tab value="includingContent">Meetings including content</Tab>
<Tab value="missed">Meetings you missed</Tab>
<Tab value="recorded">Recorded Meetings</Tab>
<Tab value="mentionsOfYou">Mentions of you</Tab>
</TabList>
<Field label="Filter by keyword">
  <Input />
</Field>

{variant === 'stitchedGridsRowNavigation' && (
        <RecentMeetingsStitchedTreeGridRowNavigationRenderer recentCategories={recentCategoriesRef.current} recentMeetings={recentMeetings} />
        )}

        {variant === 'gridsRowNavigation' && (
        <RecentMeetingsTreeGridRowNavigationRenderer recentCategories={recentCategoriesRef.current} recentMeetings={recentMeetings} />
        )}

{variant === 'gridsCellNavigation' && (
        <RecentMeetingsTreeGridCellNavigationRenderer recentCategories={recentCategoriesRef.current} recentMeetings={recentMeetings} />
        )}

        {variant === 'lists' && (
        <RecentMeetingsTreeListRenderer recentCategories={recentCategoriesRef.current} recentMeetings={recentMeetings} />
        )}
      </div>
    </>
  );
};
