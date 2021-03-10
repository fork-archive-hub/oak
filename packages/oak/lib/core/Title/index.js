import { SelectField, TextField, ColorPicker } from '@poool/junipero';
import React, { useContext } from 'react';

import { AppContext } from '../../contexts';
import Edit from '../Edit';

import styles from '../Text/index.styl';

const Title = ({ element }) => {

  return (
    <span style={{
      color: element.style?.color,
      textAlign: element.style?.textAlign,
      width: element.style?.width,
    }}>
      {element.headingLevel === 1
        ? <h1>{element.content}</h1>
        : element.headingLevel === 2
          ? <h2 >{element.content}</h2>
          : element.headingLevel === 3
            ? <h3>{element.content}</h3>
            : <h4>{element.content}</h4>}
    </span>
  );
};

Title.options = [{
  render: ({ element }) => {
    const { setElement } = useContext(AppContext);
    const headings = [
      { title: 'Heading 1', value: 1 },
      { title: 'Heading 2', value: 2 },
      { title: 'Heading 3', value: 3 },
      { title: 'Heading 4', value: 4 },
    ];
    const horizontal = [
      { title: 'Aligné à gauche', value: 'flex-start' },
      { title: 'Centré', value: 'center' },
      { title: 'Aligné à droite', value: 'flex-end' },
    ];

    const textAlign = [
      { title: 'Aligné à gauche', value: 'start' },
      { title: 'Centré', value: 'center' },
      { title: 'Aligné à droite', value: 'end' },
      { title: 'Justifié', value: 'justify' },
    ];

    return (
      <Edit title='Title options'>
        <SelectField
          label="Alignement horizontal"
          boxed={false}
          value={element.headingLevel || 1}
          parseValue={item => item.value}
          parseTitle={item => item.title}
          className={styles.item}
          onChange={item => {
            setElement(element, { headingLevel: item.value });
          }}
          options={headings}
        />
        <TextField
          rows={1}
          required={true}
          boxed={false}
          placeholder="Content"
          value={element.content}
          onChange={item => {
            setElement(element, { content: item.value });
          }}
        />
        <ColorPicker
          value={element.style?.color || '#000000'}
          onChange={item => {
            setElement(element.style, { color: item.value });
          }}
        />
        <SelectField
          label="Alignement horizontal"
          boxed={false}
          value={element.style?.horizontalAlignement || 'flex-start'}
          parseValue={item => item.value}
          parseTitle={item => item.title}
          className={styles.item}
          onChange={item => {
            setElement(element.style, { horizontalAlignement: item.value });
          }}
          options={horizontal}
        />
        <SelectField
          label="Alignement texte"
          boxed={false}
          value={element.style?.textAlign || 'start'}
          parseValue={item => item.value}
          parseTitle={item => item.title}
          className={styles.item}
          onChange={item => {
            setElement(element.style, { textAlign: item.value });
          }}
          options={textAlign}
        />
        <TextField
          boxed={false}
          placeholder="Largeur fixe"
          value={element.style?.width}
          onChange={item => {
            setElement(element.style, { width: item.value });
          }}
        />
      </Edit>
    );
  },
}];
export default Title;
