import { Meta } from '@storybook/react';
import { Chat } from '@fluentui-contrib/react-chat';
export { Default } from './Default.stories';
export { ChatWithFocusableContent } from './ChatWithFocusableContent.stories';
export { AccessibleMeetUsingStitchedGridsRowNavigation } from './AccessibleMeetUsingStitchedGridsRowNavigation.stories';
export { AccessibleMeetUsingGridsRowNavigation } from './AccessibleMeetUsingGridsRowNavigation.stories';
export { AccessibleMeetUsingGridsCellNavigation } from './AccessibleMeetUsingGridsCellNavigation.stories';
export { AccessibleMeetUsingLists } from './AccessibleMeetUsingLists.stories';

const meta: Meta<typeof Chat> = {
  component: Chat,
};

export default meta;
