import { useRef } from 'react';
import { classNames } from '@poool/junipero-utils';

import { useBuilder } from '../../hooks';
import Catalogue from '../Catalogue';
import Option from '../Option';
import Element from '../Element';
import Droppable from '../Droppable';
import Editable from '../Editable';
import settings from './index.settings';
import Icon from '../Icon';

const Col = ({
  element,
  className,
  onPrepend,
  onAppend,
  onRemove,
  ...rest
}) => {
  const editableRef = useRef();
  const prependCatalogueRef = useRef();
  const appendCatalogueRef = useRef();
  const settingsElementRef = useRef();
  const { addElement, moveElement, getText } = useBuilder();

  const onPrependCol_ = e => {
    e.preventDefault();
    onPrepend?.();
  };

  const onAppendCol_ = e => {
    e.preventDefault();
    onAppend?.();
  };

  const onRemove_ = e => {
    e.preventDefault();
    onRemove?.();
  };

  const onEdit_ = e => {
    e.preventDefault();
    editableRef.current?.toggle();
  };

  const onPrepend_ = component => {
    const elmt = component.construct?.() || {};
    addElement?.({
      ...elmt,
      content: typeof elmt.content === 'function'
        ? elmt.content(getText) : elmt.content,
    }, { parent: element.content, position: 'before' });
    prependCatalogueRef.current?.close();
  };

  const onAppend_ = component => {
    const elmt = component.construct?.() || {};
    addElement?.({
      ...elmt,
      content: typeof elmt.content === 'function'
        ? elmt.content(getText) : elmt.content,
    }, { parent: element.content, position: 'after' });
    appendCatalogueRef.current?.close();
  };

  const onDrop_ = data => {
    moveElement?.(data, element, {
      parent: element.content, position: 'after' });
  };

  return (
    <div
      { ...rest }
      className={classNames(
        'oak-col',
        {
          ['oak-col-' + element.size]: element.size && element.size !== 'fluid',
        },
        className
      )}
    >
      <div className="oak-col-wrapper">
        <div className="oak-divider oak-prepend">
          <a href="#" draggable={false} onClick={onPrependCol_}>
            <Icon className="oak-append-icon">add</Icon>
          </a>
        </div>
        <Droppable disabled={element.content.length > 0} onDrop={onDrop_}>
          <div className="oak-col-inner">
            { element.content.length > 0 && (
              <Catalogue
                ref={prependCatalogueRef}
                onAppend={onPrepend_}
              />
            ) }

            { element.content?.length > 0 && (
              <div className="oak-col-content">
                { element.content?.map((item, i) => (
                  <Element
                    key={item.id || i}
                    index={i}
                    parent={element.content}
                    element={item}
                  />
                )) }
              </div>
            ) }

            <Catalogue
              ref={appendCatalogueRef}
              onAppend={onAppend_}
            />
          </div>
        </Droppable>
        <div className="oak-divider oak-append">
          <a href="#" draggable={false} onClick={onAppendCol_}>
            <Icon className="oak-append-icon">add</Icon>
          </a>
        </div>

        <div className="oak-options">
          <Editable
            ref={editableRef}
            element={element}
            component={{ settings }}
            container={settingsElementRef}
          >
            <Option
              className="oak-edit"
              option={{ icon: 'edit' }}
              onClick={onEdit_}
            />
          </Editable>
          <Option
            className="oak-remove"
            option={{ icon: 'clear' }}
            onClick={onRemove_}
          />
        </div>
      </div>

      <div ref={settingsElementRef} />
    </div>
  );
};

export default Col;
