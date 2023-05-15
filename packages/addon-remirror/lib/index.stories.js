import { action } from '@storybook/addon-actions';
import { Builder, baseAddon } from '@oakjs/react';

import { remirrorFieldAddon } from './addons';

export default { title: 'React/With addon: Remirror' };

const baseContent = [
  { type: 'text', content: 'This is a title' },
];

const addon = {
  overrides: [{
    type: 'component',
    targets: ['text', 'title', 'button'],
    fields: [{
      key: 'content',
      type: 'remirror',
    }],
  }],
};

export const basic = () => (
  <Builder
    addons={[baseAddon(), remirrorFieldAddon(), addon]}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
    onChange={action('change')}
  />
);
