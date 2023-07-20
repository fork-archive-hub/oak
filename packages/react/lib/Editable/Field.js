import { useMemo } from 'react';

import { useBuilder } from '../hooks';

const Field = ({
  setting: fieldSetting,
  element,
  component,
  onChange,
  onCustomChange,
  editableRef,
}) => {
  const { builder, floatingsRef } = useBuilder();
  const field = useMemo(() => (
    builder.getField(fieldSetting?.type)
  ), [fieldSetting]);

  const overrides = useMemo(() => ({
    field: builder.getOverride('component', element.type, {
      output: 'field', setting: fieldSetting,
    }),
    settings: builder
      .getOverride('setting', element.type, { setting: fieldSetting }),
  }), [element, field]);

  const setting = useMemo(() => ({
    ...fieldSetting,
    ...overrides.settings,
    ...overrides.field,
  }), [fieldSetting, overrides]);

  const fieldProps = {
    id: setting.id,
    name: setting.name,
    disabled: setting.disabled,
    value: builder.getElementSettings(element, setting.key, setting.default),
    required: setting.required,
    onChange: overrides?.onChange
      ? onCustomChange.bind(null, setting.key, overrides.field)
      : onChange.bind(null, setting.key),
    ...field?.props,
    ...overrides.field?.props,
  };

  if (setting.condition &&
    !setting.condition(element, { component, builder })) {
    return null;
  }

  return (overrides.field?.render || field?.render)?.(fieldProps, {
    onChange: onChange.bind(null, setting.key),
    field,
    setting,
    overrides: overrides.field,
    element,
    editableRef,
    floatingsRef,
    t: builder.getText.bind(builder),
  }) || null;
};

Field.displayName = 'Field';

export default Field;
