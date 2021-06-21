import { DBSchema } from '@ngrx/db';

/**
 * ngrx/db uses a simple schema config object to initialize stores in IndexedDB.
 */
export const myChangeSchema: DBSchema = {
  version: 1,
  name: 'myChange',
  stores: {
    changeRequest: {
      autoIncrement: true,
      primaryKey: 'id'
    },
  },
};
