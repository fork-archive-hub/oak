import { Component, ComponentsGroup } from '../types';
import Emitter from '../Emitter';

export default class Components extends Emitter {
  static TYPE_COMPONENT = 'component';
  static TYPE_GROUP = 'group';

  static COMPONENTS_GROUP_CORE = 'core';
  static COMPONENTS_GROUP_OTHER = 'other';

  #builder = null;
  #groups = null;
  #defaultGroup = null; // Other tab

  constructor ({ builder } = {}) {
    super();

    this.#builder = builder;
    this.#groups = [];
    this.#defaultGroup = new ComponentsGroup({
      type: 'group',
      id: Components.COMPONENTS_GROUP_OTHER,
      name: t => t('core.components.other.title', 'Other'),
      components: [],
    });
  }

  hasGroup (id) {
    return this.#groups.some(ComponentsGroup.FIND_PREDICATE(id));
  }

  getGroup (id) {
    return this.#groups.find(ComponentsGroup.FIND_PREDICATE(id));
  }

  hasComponent (id, { groupId } = {}) {
    if (groupId) {
      return this.getGroup(groupId)?.components
        .some(Component.FIND_PREDICATE.bind(null, id));
    }

    for (const group of this.#groups) {
      if (group.components.some(Component.FIND_PREDICATE(id))) {
        return true;
      }
    }

    return this.#defaultGroup.components
      .some(Component.FIND_PREDICATE.bind(null, id));
  }

  getComponent (id, { groupId } = {}) {
    if (groupId) {
      return this.getGroup(groupId)?.components
        ?.find(Component.FIND_PREDICATE(id));
    }

    for (const group of this.#groups) {
      const component = group.components.find(Component.FIND_PREDICATE(id));

      if (component) {
        return component;
      }
    }

    return this.#defaultGroup.components.find(Component.FIND_PREDICATE(id));
  }

  append (component) {
    return this.add(component, { mode: 'append' });
  }

  prepend (component) {
    return this.add(component, { mode: 'prepend' });
  }

  add (component, { mode = 'append' } = {}) {
    const mutateMethod = mode === 'append' ? 'push' : 'unshift';

    // This component is a group, add a new group
    if (component.type === Components.TYPE_GROUP) {
      if (!this.hasGroup(component.id)) {
        component = new ComponentsGroup(component);
        component.components = component.components || [];

        this.#groups[mutateMethod](component);
        this.emit('groups.add', component);
      }

      return;
    }

    component = new Component(component);

    const group = component.group && this.hasGroup(component.group)
      ? this.getGroup(component.group)
      : this.#defaultGroup;

    const existing = this.getComponent(component.id, { groupId: group.id });

    if (existing) {
      this.#builder.logger.log(
        'Component already exists, updating definition.',
        'Old:', existing,
        'New:', component
      );

      const index = group.components.indexOf(existing);
      group.components[index] = component;
      this.emit('components.update', component, group);
    } else {
      group.components[mutateMethod](component);
      this.emit('components.add', component, group);
    }
  }

  remove (id) {
    const groupIndex = this.#groups
      .findIndex(ComponentsGroup.FIND_PREDICATE(id));

    if (groupIndex !== -1) {
      this.#builder.logger.log('Removing group:', this.#groups[groupIndex]);
      const group = this.#groups[groupIndex];
      this.#groups.splice(groupIndex, 1);
      this.emit('groups.remove', group);

      return;
    }

    for (const group of this.#groups) {
      const index = group.components
        .findIndex(Component.FIND_PREDICATE(id));

      if (index !== -1) {
        this.#builder.logger
          .log('Removing component:', group.components[index]);
        const component = group.components[index];
        group.components.splice(index, 1);
        this.emit('components.remove', component, group);

        return;
      }
    }

    const index = this.#defaultGroup.components
      .findIndex(Component.FIND_PREDICATE(id));

    if (index !== -1) {
      this.#builder.logger.log(
        'Removing component:', this.#defaultGroup.components[index]
      );
      const component = this.#defaultGroup.components[index];
      this.#defaultGroup.components.splice(index, 1);
      this.emit('components.remove', component, this.#defaultGroup);
    }
  }

  all () {
    return {
      groups: this.#groups,
      defaultGroup: this.#defaultGroup,
    };
  }

  getDisplayableSettings (element, { fields, component } = {}) {
    const displayable = [];

    if (!fields) {
      component = component || this.getComponent(element.type);

      if (!component?.settings || !component?.settings.fields) {
        return displayable;
      }

      fields = component?.settings.fields;
    }

    for (const setting of fields) {
      if (Array.isArray(setting.fields)) {
        displayable.push(...this.getDisplayableSettings(element, {
          fields: setting.fields,
        }));
      }

      if (
        setting.displayable === true ||
        (
          typeof setting.displayable === 'function' &&
          setting.displayable({ element, builder: this.#builder })
        )
      ) {
        displayable.push(setting);
      }
    }

    return displayable;
  }

  toJSON () {
    return this.all();
  }
}
