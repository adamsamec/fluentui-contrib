import * as React from 'react';
import { RecentCategory, UpcomingMeeting, RecentMeetings } from './AccessibleMeetBase';

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableCellActions,
  TableCellLayout,
  useArrowNavigationGroup,
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
  useFluent,
} from '@fluentui/react-components';

interface IRecentMeetingsStitchedGridRowNavigationRendererProps {
  recentCategories: RecentCategory[];
  recentMeetings: RecentMeetings;
}
export const RecentMeetingsStitchedTreeGridRowNavigationRenderer: React.FC<IRecentMeetingsStitchedGridRowNavigationRendererProps> = ({ recentCategories, recentMeetings }) => {
  const { targetDocument } = useFluent();
  const [recentCategoriesState, setRecentCategoryState] = React.useState(recentCategories);

  const { tableTabsterAttribute, onTableKeyDown } = useTableCompositeNavigation();

  const getCategoryById = React.useCallback((id: string) => {
    return recentCategoriesState.find(category => {
      return id === category.id;
    });
  }, [recentCategoriesState]);

  const changeRecentCategoryExpandedState = React.useCallback((category: RecentCategory | undefined, expanded: boolean) => {
    if (category) {
      category.expanded = expanded;
    }
    setRecentCategoryState([...recentCategoriesState]);
  }, [recentCategoriesState]);

  const handleRowClick = React.useCallback((event: React.MouseEvent) => {
    const element = event.target as HTMLElement;
    const selectedRowId = element.id;
    const category = getCategoryById(selectedRowId);
    changeRecentCategoryExpandedState(category, !category?.expanded);
  }, []);

  const handleTreeGridKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    let callTabsterKeyboardHandler = true;
    const element = event.target as HTMLElement;
    if (element.role === 'row') {
      const isModifierDown = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      if (!isModifierDown) {
        const selectedRowId = element.id;
        const category = getCategoryById(selectedRowId);
        const level = element.getAttribute('aria-level');
        if (event.key === 'ArrowRight' && level === '1' && category && !category.expanded) {
          changeRecentCategoryExpandedState(category, true);
          callTabsterKeyboardHandler = false;
        } else if (event.key === 'ArrowLeft' && level === '1') {
          changeRecentCategoryExpandedState(category, false);
        } else if ((event.key === 'Enter' || event.key === ' ') && level === '1') {
          changeRecentCategoryExpandedState(category, !category?.expanded);
        } else if (event.key === 'ArrowLeft' && level === '2') {
          const categoryToFocus = recentCategories.find(category => {
            return !!recentMeetings[category.id].find(meeting => {
              return meeting.id === selectedRowId;
            });
          }) as RecentCategory;
          const categoryRowToFocus = targetDocument?.getElementById(categoryToFocus.id) as HTMLElement;
          categoryRowToFocus.focus();
        }
      }
    }
    if (callTabsterKeyboardHandler) {
      onTableKeyDown(event);
    }
  }, [changeRecentCategoryExpandedState, recentCategories, recentMeetings, setRecentCategoryState, onTableKeyDown, targetDocument]);

  return (
    <div
    role="group"
      aria-label="All meetings"
      aria-describedby="lastMeetings-hint"
      onKeyDown={handleTreeGridKeyDown}
      {...tableTabsterAttribute}
    >
      {recentCategories.map((category, categoryIndex) => (
        <Table
          role="treegrid"
          noNativeElements
        >
          <TableBody role="presentation">
            <TableRow
              key={category.id}
              role="row"
              id={category.id}
              tabIndex={0}
              onClick={handleRowClick}
              aria-level={1}
              aria-posinset={categoryIndex + 1}
              aria-setsize={recentCategories.length}
              // aria-expanded={category.expanded}
            >
              <TableCell
                role="gridcell"
                tabIndex={0}
              >{category.title}</TableCell>
              <TableCell role="gridcell" colSpan={6}>        <Button>Header action</Button></TableCell>

            </TableRow>
            {category.expanded && recentMeetings[category.id].map((meeting) => (
              <TableRow
                key={meeting.id}
                role="row"
                id={meeting.id}
                tabIndex={0}
                aria-level={2}
              >
                <TableCell role="gridcell" tabIndex={0}>{meeting.titleWithTime}</TableCell>
                <TableCell role="gridcell"><Button>Chat with participants</Button></TableCell>
                <TableCell role="gridcell"><Button>View recap</Button></TableCell>
                <TableCell role="gridcell">
                  {meeting.properties?.includes('includingContent') &&
                  <Button>Agenda and notes</Button>
                }
                </TableCell>
                <TableCell role="gridcell">
                  {meeting.tasksCount  &&
                  <Button>{meeting.tasksCount} tasks</Button>
                }
                </TableCell>
                <TableCell role="gridcell">
                  {meeting.properties?.includes('transcript') &&
                  <Button>Transcript</Button>
                }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ))}
    </div>
  );
};
