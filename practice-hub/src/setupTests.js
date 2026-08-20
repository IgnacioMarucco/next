import { GlobalRegistrator } from '@happy-dom/global-registrator';
if (!globalThis.document) {
  GlobalRegistrator.register();
}

import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, afterEach } from 'bun:test';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
