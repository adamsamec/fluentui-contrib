import { Meta } from '@storybook/react';
import { TreeGrid } from '@fluentui-contrib/react-tree-grid';
import description from '../README.md';

export { ParticipantsRowGroupedGridList } from './ParticipantsRowGroupedGridList.stories';
export { ParticipantsGroupedGridList } from './ParticipantsGroupedGridList.stories';
export { ParticipantsGridList } from './ParticipantsGridList.stories';
export { ParticipantsTreeGrid } from './ParticipantsTreeGrid.stories';
// export { Default } from './Default.stories';
// export { Meet } from './Meet.stories';
// export { LiveMeetingsList } from './LiveMeetingsList.stories';
// export { Virtualization } from './Virtualization.stories';
// export { EmailInbox } from './EmailInbox.stories';
// export { Calls } from './Calls.stories';

const meta = {
  title: 'Participants menu prototype',
  component: TreeGrid,
  parameters: {
    docs: {
      description: {
        component: [description].join('\n'),
      },
    },
  },
} as Meta<typeof TreeGrid>;

export default meta;
