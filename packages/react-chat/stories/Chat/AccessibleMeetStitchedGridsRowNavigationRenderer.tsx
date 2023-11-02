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

  const { tableRowTabsterAttribute, tableTabsterAttribute, onTableKeyDown } = useTableCompositeNavigation();

  const changeRecentCategoryExpandedState = React.useCallback((id: string, expanded: boolean) => {
    recentCategoriesState.find(category => {
      if (id === category.id) {
        category.expanded = expanded;
        return true;
      }
      return false;
    });
    setRecentCategoryState([...recentCategoriesState]);
  }, [recentCategoriesState]);

  const handleTreeGridKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    let callTabsterKeyboardHandler = true;
    const element = event.target as HTMLElement;
    if (element.role === 'row') {
      const isModifierDown = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
      if (!isModifierDown) {
        const selectedRowId = element.id;
        const level = element.getAttribute('aria-level');
        if (event.key === 'ArrowRight' && level === '1') {
          changeRecentCategoryExpandedState(selectedRowId, true);
          callTabsterKeyboardHandler = false;
        } else if (event.key === 'ArrowLeft' && level === '1') {
          changeRecentCategoryExpandedState(selectedRowId, false);
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
    role="treegrid"
    aria-label="All meetings"
    aria-describedby="lastMeetings-hint"
    onKeyDown={handleTreeGridKeyDown}
    {...tableTabsterAttribute}
    >
{recentCategories.map(category => (
      <Table
      role="presentation"
        noNativeElements
      >
        <TableBody role="presentation">
              <TableRow
                key={category.id}
                id={category.id}
                role="row"
                tabIndex={0}
                aria-level={1}
                  // aria-expanded={category.expanded}
                  {...tableRowTabsterAttribute}
              >
                <TableCell
                  role="gridcell"
                  tabIndex={0}
                  colSpan={4}
                >{category.title}</TableCell>
              </TableRow>
              {category.expanded && recentMeetings[category.id].map((meeting) => (
                <TableRow
                  key={meeting.id}
                  id={meeting.id}
                  role="row"
                  tabIndex={0}
                  aria-level={2}
                  {...tableRowTabsterAttribute}
                >
                  <TableCell role="gridcell" tabIndex={0}>{meeting.titleWithTime}</TableCell>
                  <TableCell role="gridcell">        <Button>Agenda and notes</Button></TableCell>
                  <TableCell role="gridcell"><Button>Chat with participants</Button></TableCell>
                  <TableCell role="gridcell"><Button>View recap</Button></TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
          ))}
          </div>
  );
};
