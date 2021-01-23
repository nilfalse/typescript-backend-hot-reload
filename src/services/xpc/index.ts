import { tabDetails, TabDetails } from '../../controllers/storage_controller';
import { CountryRequest } from '../../lib/country_request';

function getTabDetails(tabId: number) {
  return tabDetails.fetch(tabId);
}

export async function handle(message: any) {
  switch (message.type) {
    case 'getTabDetails':
      return getTabDetails(message.payload);
    default:
      throw new Error('Unexpected message type ' + message.type);
  }
}

const transformers: Record<string, any> = {
  getTabDetails(payload: TabDetails | null): TabDetails | null {
    return payload
      ? {
          ...payload,
          request: CountryRequest.fromJSON(payload.request),
        }
      : payload;
  },
};

export function dispatch(
  type: 'getTabDetails',
  payload: number
): Promise<TabDetails>;

export function dispatch(type: string, payload?: any) {
  return new Promise((resolve, reject) => {
    const message = {
      type,
      payload,
    };

    chrome.runtime.sendMessage(message, (payload: any) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(type in transformers ? transformers[type](payload) : payload);
      }
    });
  });
}
