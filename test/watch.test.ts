require('./polyfill/index');
import { callWatch } from '../src/compute';
import { innerMatch, match } from '../src/utils/match';

describe('innerMatch **', () => {
  it('innerMatch: some.field.**, some.field ', () => {
    const isMatch = innerMatch('some.field.**', 'some.field');
    expect(isMatch).toBe(true);
  });

  it('innerMatch: some.field.**, some.field.xxx ', () => {
    const isMatch = innerMatch('some.field.**', 'some.field.abc');
    expect(isMatch).toBe(true);
  });

  it('innerMatch: some.field.**, some ', () => {
    const isMatch = innerMatch('some.field.**', 'some');
    expect(isMatch).toBe(true);
  });

  it('innerMatch: **, some ', () => {
    const isMatch = innerMatch('**', 'some');
    expect(isMatch).toBe(true);
  });

  it('innerMatch: some.field.**, some1', () => {
    const isMatch = innerMatch('some.field.**', 'some1');
    expect(isMatch).toBe(false);
  });
});

describe('innerMatch', () => {
  it('innerMatch: some.field, some.field ', () => {
    const isMatch = innerMatch('some.field', 'some.field');
    expect(isMatch).toBe(true);
  });

  it('innerMatch: some.field, some.field.xxx ', () => {
    const isMatch = innerMatch('some.field', 'some.field.abc');
    expect(isMatch).toBe(true);
  });

  it('innerMatch: some.field, some ', () => {
    const isMatch = innerMatch('some.field', 'some');
    expect(isMatch).toBe(true);
  });

  it('innerMatch: some.field, some2 ', () => {
    const isMatch = innerMatch('some.field', 'some2');
    expect(isMatch).toBe(false);
  });
});

describe('match', () => {
  it('match: some.field.**, some.field => true', () => {
    const isMatch = match(['some.field.**', 'other'], 'some.field');
    expect(isMatch).toBe(true);
  });
});

describe('callWatch', () => {
  it('callWatch: a , a ', () => {
    const scope = {
      data: {
        a: 1
      }
    };

    const updateData = {
      a: 1
    };

    const watch = {
      a(a: any) {
        expect(a).toBe(scope.data.a);
      }
    };

    callWatch(scope, updateData, watch);
  });

  it('callWatch: obj, obj.b ', () => {
    const scope = {
      data: {
        obj: 2
      }
    };

    const updateData = {
      obj: 2
    };

    const watch = {
      ['obj.b'](b: any) {
        expect(b).toBeUndefined();
      }
    };

    callWatch(scope, updateData, watch);
  });

  it('callWatch: numberA, numberA, numberB ', () => {
    const scope = {
      data: {
        numberA: 1,
        numberB: 2
      }
    };

    const updateData = {
      numberA: 1
    };

    const watch = {
      ['numberA, numberB'](numberA: any, numberB: any) {
        expect(numberA).toBe(1);
        expect(numberB).toBe(2);
      }
    };

    callWatch(scope, updateData, watch);
  });

  it('callWatch: numberA, ** ', () => {
    const scope = {
      data: {
        numberA: 1,
        numberB: 2
      }
    };

    const updateData = {
      numberA: 1
    };

    const watch = {
      ['**'](data: any) {
        expect(data.numberA).toBe(1);
        expect(data.numberB).toBe(2);
      }
    };

    callWatch(scope, updateData, watch);
  });

  it('callWatch: *, some.field.** ', () => {
    const scope = {
      data: {
        some: {
          field: {
            a: 1
          }
        }
      }
    };

    const updateData1 = {
      'some.field': {
        a: 1
      }
    };

    const watch = {
      ['some.field.**'](field: any) {
        expect(field.a).toBe(1);
      }
    };

    callWatch(scope, updateData1, watch);

    const updateData2 = {
      'some.field.a': 1
    };
    callWatch(scope, updateData2, watch);

    const updateData3 = {
      some: {
        field: {
          a: 1
        }
      }
    };
    callWatch(scope, updateData3, watch);
  });
});
