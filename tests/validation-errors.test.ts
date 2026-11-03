import { expect, test } from 'bun:test';
import * as v from 'valibot';

test('invalid records retain structured errors for inherited property names', () => {
  const schema = v.record(v.string(), v.number());

  for (const key of ['toString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'ordinary']) {
    const result = v.safeParse(schema, { [key]: 'not a number' });

    expect(result.success).toBe(false);

    if (result.issues === undefined) throw new Error('the invalid record must have issues');
    const errors = v.flatten(result.issues);

    expect(Object.hasOwn(errors.nested ?? {}, key)).toBe(true);
    expect(errors.nested?.[key]).toHaveLength(1);
  }
});
