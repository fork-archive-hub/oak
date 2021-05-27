import Text from './core/Text';
import Title from './core/Title';
import Image from './core/Image';
import { serialize, deserialize } from './core/Editor/html';

export const COMPONENT_TITLE = {
  id: 'title',
  name: 'Title',
  type: 'component',
  icon: 'title',
  render: Title,
  options: Title.options,
  settings: Title.settings,
  editable: true,
  serialize,
  deserialize,
  construct: () => ({
    type: 'title',
    content: 'This is a title',
    headingLevel: 'h1',
    settings: {},
  }),
};

export const COMPONENT_TEXT = {
  id: 'text',
  name: 'Text',
  type: 'component',
  render: Text,
  icon: 'format_align_left',
  options: Text.options,
  settings: Text.settings,
  editable: true,
  serialize,
  deserialize,
  construct: () => ({
    type: 'text',
    content: 'This is some fancy text content, you can even use ' +
      '<strong>html</strong> here',
    settings: {},
  }),
};

export const COMPONENT_IMAGE = {
  id: 'image',
  name: 'Image',
  type: 'component',
  render: Image,
  icon: 'image',
  options: Image.options,
  settings: Image.settings,
  editable: true,
  construct: () => ({
    type: 'image',
    url: '',
    name: '',
    settings: {},
  }),
};
