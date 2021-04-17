import { deleteOutline, addCircleOutline, edit } from '@advanced-rest-client/arc-icons';
import { StoreEvents } from '@api-client/amf-store';
import { ReportingEvents } from '../events/reporting/ReportingEvents.js';

/** @typedef {import('@api-client/context-menu').ContextMenuCommand} ContextMenuCommand */
/** @typedef {import('@api-client/context-menu').EnabledOptions} EnabledOptions */
/** @typedef {import('@api-client/context-menu').ExecuteOptions} ExecuteOptions */
/** @typedef {import('../GraphApiNavigationElement').default} GraphApiNavigationElement */
/** @typedef {import('../types').SchemaAddType} SchemaAddType */

/**
 * @param {EnabledOptions} ctx
 * @param {string} operation
 * @return {boolean} 
 */
function isAddMethodEnabled(ctx, operation) {
  const collapse = (ctx.target.nextElementSibling);
  if (collapse && collapse.localName === 'anypoint-collapse') {
    const item = collapse.querySelector(`[data-operation="${operation}"]`);
    return !item;
  }
  return true;
}

/**
 * @param {ExecuteOptions} ctx
 */
function renameTarget(ctx) {
  const { target } = ctx;
  const { graphId } = target.dataset;
  if (!graphId) {
    return;
  }
  const menu = /** @type GraphApiNavigationElement */ (ctx.root);
  menu.renameAction(graphId);
}

const commands = /** @type ContextMenuCommand[] */ ([
  {
    target: 'all',
    label: 'Expand all',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.expandAll();
    },
  },
  {
    target: 'all',
    label: 'Collapse all',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.collapseAll();
    },
  },
  {
    target: 'endpoints',
    label: 'Expand all endpoints',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.expandAllEndpoints();
    },
  },
  {
    target: 'endpoints',
    label: 'Collapse all endpoints',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.collapseAllEndpoints();
    },
  },
  {
    type: 'separator',
    target: ['endpoints', 'endpoint', 'operations', 'operation', 'documentation', 'schemas', 'schema'],
  },
  {
    target: 'endpoints',
    label: 'Add endpoint',
    execute: (ctx) => {
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.addEndpoint();
    },
  },
  {
    target: 'endpoint',
    label: 'Delete endpoint',
    icon: deleteOutline,
    execute: async (ctx) => {
      const { graphId } = ctx.target.dataset;
      if (!graphId) {
        return;
      }
      try {
        await StoreEvents.Endpoint.delete(ctx.root, graphId);
      } catch (e) {
        ReportingEvents.error(this, e, `Unable to create an endpoint: ${e.message}`, 'Navigation commands');
      }
    },
  },
  {
    target: 'endpoint',
    label: 'Add operation',
    icon: addCircleOutline,
    execute: async (ctx) => {
      const { item } = ctx;
      const method = item.id.replace('add-op-', '');
      if (!['get','post','put','patch','delete','options','head'].includes(method)) {
        return;
      }
      const { graphId } = ctx.target.dataset;
      if (!graphId) {
        return;
      }
      try {
        await StoreEvents.Operation.add(ctx.root, graphId, { method });
      } catch (e) {
        ReportingEvents.error(this, e, `Unable to create an operation: ${e.message}`, 'Navigation commands');
      }
    },
    children: [
      {
        label: 'GET',
        id: 'add-op-get',
        enabled: (ctx) => isAddMethodEnabled(ctx, 'get'),
      },
      {
        label: 'POST',
        id: 'add-op-post',
        enabled: (ctx) => isAddMethodEnabled(ctx, 'post'),
      },
      {
        label: 'PUT',
        id: 'add-op-put',
        enabled: (ctx) => isAddMethodEnabled(ctx, 'put'),
      },
      {
        label: 'PATCH',
        id: 'add-op-patch',
        enabled: (ctx) => isAddMethodEnabled(ctx, 'patch'),
      },
      {
        label: 'DELETE',
        id: 'add-op-delete',
        enabled: (ctx) => isAddMethodEnabled(ctx, 'delete'),
      },
      {
        type: 'separator',
      },
      {
        label: 'OPTIONS',
        id: 'add-op-options',
        enabled: (ctx) => isAddMethodEnabled(ctx, 'options'),
      },
      {
        label: 'HEAD',
        id: 'add-op-head',
        enabled: (ctx) => isAddMethodEnabled(ctx, 'head'),
      },
    ],
  },
  {
    target: 'endpoint',
    label: 'Rename',
    icon: edit,
    execute: (ctx) => renameTarget(ctx),
  },
  {
    target: 'operation',
    label: 'Rename',
    icon: edit,
    execute: (ctx) => renameTarget(ctx),
  },
  {
    target: 'operation',
    label: 'Delete',
    icon: deleteOutline,
    execute: async (ctx) => {
      const { graphId } = ctx.target.dataset;
      if (!graphId) {
        return;
      }
      try {
        await StoreEvents.Operation.delete(ctx.root, graphId);
      } catch (e) {
        ReportingEvents.error(this, e, `Unable to delete an operation: ${e.message}`, 'Navigation commands');
      }
    },
  },
  {
    target: 'documentations',
    label: 'Add',
    icon: addCircleOutline,
    children: [
      {
        label: 'Documentation',
        execute: (ctx) => {
          const menu = /** @type GraphApiNavigationElement */ (ctx.root);
          menu.addDocumentation();
        }
      },
      {
        label: 'External documentation',
        execute: (ctx) => {
          const menu = /** @type GraphApiNavigationElement */ (ctx.root);
          menu.addDocumentation(true);
        }
      },
    ],
  },
  {
    target: 'documentation',
    label: 'Rename',
    icon: edit,
    execute: (ctx) => renameTarget(ctx),
  },
  {
    target: 'documentation',
    label: 'Delete',
    icon: deleteOutline,
    execute: async (ctx) => {
      const { graphId } = ctx.target.dataset;
      if (!graphId) {
        return;
      }
      try {
        await StoreEvents.Documentation.delete(ctx.root, graphId);
      } catch (e) {
        ReportingEvents.error(this, e, `Unable to delete a documentation: ${e.message}`, 'Navigation commands');
      }
    },
  },
  {
    target: 'schemas',
    label: 'Add schema',
    icon: addCircleOutline,
    execute: (ctx) => {
      const type = ctx.item.id.replace('schema-', '');
      if (!['scalar','object','file','array','union'].includes(type)) {
        return;
      }
      const menu = /** @type GraphApiNavigationElement */ (ctx.root);
      menu.addSchema(/** @type SchemaAddType */ (type));
    },
    children: [
      {
        label: 'Scalar',
        id: 'schema-scalar',
      },
      {
        label: 'Object',
        id: 'schema-object',
      },
      {
        label: 'File',
        id: 'schema-file',
      },
      {
        label: 'Array',
        id: 'schema-array',
      },
      {
        label: 'Union',
        id: 'schema-union',
      },
    ],
  },
  {
    target: 'schema',
    label: 'Rename',
    icon: edit,
    execute: (ctx) => renameTarget(ctx),
  },
  {
    target: 'schema',
    label: 'Delete',
    icon: deleteOutline,
    execute: async (ctx) => {
      const { graphId } = ctx.target.dataset;
      if (!graphId) {
        return;
      }
      try {
        await StoreEvents.Type.delete(ctx.root, graphId);
      } catch (e) {
        ReportingEvents.error(this, e, `Unable to delete a schema: ${e.message}`, 'Navigation commands');
      }
    },
  },
]);
export default commands;
