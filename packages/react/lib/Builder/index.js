import { forwardRef, useCallback, useRef, useImperativeHandle } from 'react';
import { classNames } from '@junipero/react';

import { GROUP_CORE } from '../components';
import { BASE_FIELDTYPES } from '../fields';
import { BuilderContext } from '../contexts';
import { useRootBuilder } from '../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';

const Builder = forwardRef(({
  className,
  value,
  addons,
  onImageUpload,
  ...opts
}, ref) => {
  const innerRef = useRef();
  const catalogueRef = useRef();
  const floatingsRef = useRef();
  const { builder, content } = useRootBuilder({
    content: value,
    addons: [
      {
        components: [GROUP_CORE],
        fields: BASE_FIELDTYPES,
      },
      ...(addons || []),
    ],
    ...opts,
  });

  useImperativeHandle(ref, () => ({
    builder,
    content,
    catalogueRef,
    innerRef,
  }));

  const getContext = useCallback(() => ({
    builder,
    content,
    onImageUpload,
    rootRef: innerRef,
    floatingsRef,
  }), [builder, content, onImageUpload]);

  const onAppend = component => {
    catalogueRef.current?.close();
    builder.addElement({}, { component });
  };

  const onPaste = element => {
    catalogueRef.current?.close();
    builder.addElement(element, { resetIds: true });
  };

  return (
    <BuilderContext.Provider value={getContext()}>
      <div
        ref={innerRef}
        className={classNames(
          'oak builder',
          className
        )}
      >
        <div className="elements oak-flex oak-flex-col oak-gap-4">
          { content?.map((element, i) => (
            <Element
              key={element.id || i}
              index={i}
              element={element}
            />
          )) }

          <div className="add-element oak-flex oak-justify-center">
            <Catalogue
              ref={catalogueRef}
              onAppend={onAppend}
              onPaste={onPaste}
            />
          </div>
        </div>

        <div className="floatings" ref={floatingsRef} />
      </div>
    </BuilderContext.Provider>
  );
});

Builder.displayName = 'Builder';

export default Builder;
