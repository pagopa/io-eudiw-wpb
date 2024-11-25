import { describe, expect, it } from 'vitest';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import { makeDatabaseMock } from './mocks';
import { makeWalletInstanceRepository } from '../wallet-instance';
import { Database } from '@azure/cosmos';
import { mkWalletInstance } from '../../../../domain/__tests__/data';

describe('makeWalletInstanceRepository', () => {
  describe('get', () => {
    it('should return the item', async () => {
      const mockDB = makeDatabaseMock();
      const testDB = mockDB as unknown as Database;
      const aWalletInstance = await mkWalletInstance();
      const { id, userId } = aWalletInstance;

      mockDB.container('').item.mockReturnValueOnce({
        read: async () => Promise.resolve({ resource: aWalletInstance }),
      });

      const actual = await makeWalletInstanceRepository(testDB).get({
        id,
        userId,
      })();

      expect(actual).toStrictEqual(E.right(O.some(aWalletInstance)));
      expect(mockDB.container('').item).toBeCalledWith(id, userId);
    });
  });
});
