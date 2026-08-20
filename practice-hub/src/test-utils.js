import { GlobalRegistrator } from '@happy-dom/global-registrator';

if (!globalThis.document) {
  GlobalRegistrator.register();
}

import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'bun:test';
import * as rtl from '@testing-library/react';

expect.extend(matchers);

export * from '@testing-library/react';

export const screen = new Proxy({}, {
  get(target, prop) {
    if (globalThis.document && globalThis.document.body) {
      const queries = rtl.within(globalThis.document.body);
      return queries[prop];
    }
    return rtl.screen[prop];
  }
});
