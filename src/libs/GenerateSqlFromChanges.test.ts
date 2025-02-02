import { QueryResult } from 'types/SqlResult';
import generateSqlFromChanges from './GenerateSqlFromChanges';
import ResultChangeCollector from './ResultChangeCollector';
import { SqlStatementPlan } from 'types/SqlStatement';
import { DatabaseSchema, TableType } from 'types/SqlSchema';

test('Generate Sql from changes with primary key', () => {
  const schema = {
    name: 'testing',
    events: [],
    triggers: [],
    tables: {
      users: {
        name: 'users',
        type: 'TABLE' as TableType,
        columns: {
          id: { name: 'id' },
          name: { name: 'name' },
          age: { name: 'age' },
        },
        primaryKey: ['id'],
        constraints: [],
      },
    },
  } as unknown as DatabaseSchema;

  const data: QueryResult = {
    keys: {},
    error: null,
    headers: [
      {
        name: 'id',
        type: { type: 'number' },
        schema: { table: 'users', column: 'id' },
      },
      {
        name: 'name',
        type: { type: 'string' },
        schema: { table: 'users', column: 'name' },
      },
      {
        name: 'age',
        type: { type: 'number' },
        schema: { table: 'users', column: 'age' },
      },
    ],
    rows: [
      { id: 1, name: 'Henry', age: 25 },
      { id: 2, name: 'Jenny', age: 20 },
      { id: 3, name: 'Zeus', age: 30 },
    ],
  };

  const changes = new ResultChangeCollector();
  changes.addChange(1, 1, 'Jenny 2');
  changes.addChange(2, 2, 35);

  expect(generateSqlFromChanges(schema, data, changes.getChanges())).toEqual([
    {
      type: 'update',
      table: 'users',
      values: { name: 'Jenny 2' },
      where: { id: 2 },
    },
    {
      type: 'update',
      table: 'users',
      values: { age: 35 },
      where: { id: 3 },
    },
  ] as SqlStatementPlan[]);
});
