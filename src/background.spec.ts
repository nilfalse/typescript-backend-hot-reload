import * as harness from './__test__/harness';
import * as controllers from './controllers';
import * as airports from './services/airports/airports_service';
import * as geo from './services/geo/geo_service';
import * as debug from './util/debug';

jest.mock('./controllers');
jest.mock('./services/airports/airports_service');
jest.mock('./services/geo/geo_service');

describe('Background script', () => {
  describe('entrypoint', () => {
    it('should print the debug introduction', () => {
      const spy = jest.spyOn(debug, 'intro');

      const testingSideEffect = require('./background');

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it('should kick off controllers', () => {
      const testingSideEffect = require('./background');

      expect(controllers.start).toHaveBeenCalledTimes(1);
    });
  });

  describe('controllers', () => {
    beforeAll(geo.init);
    beforeAll(airports.init);

    const browser = harness.browser.stub();

    beforeEach(jest.requireActual('./controllers').start);

    it('should subscribe to network requests', () => {
      expect(browser.webRequest.onCompleted.addListener).toHaveBeenCalledTimes(
        1
      );

      expect(browser.webRequest.onCompleted.addListener).lastCalledWith(
        expect.any(Function),
        {
          urls: ['<all_urls>'],
          types: ['main_frame'],
        },
        ['responseHeaders']
      );
    });

    it('should subscribe to tab change events', () => {
      expect(browser.tabs.onUpdated.addListener).toHaveBeenCalledTimes(1);

      expect(browser.tabs.onUpdated.addListener).lastCalledWith(
        expect.any(Function)
      );
    });

    it('should subscribe to tab close events', () => {
      expect(browser.tabs.onRemoved.addListener).toHaveBeenCalledTimes(1);

      expect(browser.tabs.onRemoved.addListener).lastCalledWith(
        expect.any(Function)
      );
    });

    it('should subscribe to popup messages', () => {
      expect(browser.runtime.onMessage.addListener).toHaveBeenCalledTimes(1);

      expect(browser.runtime.onMessage.addListener).lastCalledWith(
        expect.any(Function)
      );
    });
  });
});
