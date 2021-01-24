import { CountryRequest, CountryRequestParams } from '../lib/country_request';
import { Report } from '../lib/report';
import { publish } from '../util/mediator';

import { UpdatePayloadsRepoCommand } from './update_payloads_repo';

export class CountryReplyCommand {
  request: CountryRequest;

  constructor(public tabId: number, payload: CountryRequestParams) {
    this.tabId = tabId;
    this.request = new CountryRequest(payload);
  }

  execute() {
    publish(new UpdatePayloadsRepoCommand(this.tabId, this.request));

    return this._execute();
  }

  async _execute() {
    const interceptors = await import(
      /* webpackChunkName: "interceptors" */ '../interceptors'
    );

    return new Report(await interceptors.run(this.request));
  }
}