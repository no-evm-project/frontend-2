// normalize object data
// {
//     "symbol": "SPOT_NEAR_USDC",
//     "order_type": "LIMIT",
//     "order_price": 15.23,
//     "order_quantity": 23.11,
//     "side": "BUY"
//   }
//  to
// order_price=15.23&order_quantity=23.11&order_type=LIMIT&side=BUY&symbol=SPOT_NEAR_USDC
// Remove any null fields from the order parameters (or cancel parameters)
// Remove any trailing zeros for any numeric order parameter (eg. 150.00 to 150, 150.10 to 150.1)
// Sort order parameters in alphabetical order
// Concatenate order parameters in query string format.

export function normalizeData(data: any) {
	  const keys = Object.keys(data).sort();
  const normalizedData = keys.reduce((acc: string[], key) => {
	const value = data[key];
	if (value !== null) {
	  if (typeof value === 'number') {
		acc.push(`${key}=${value.toFixed(8).replace(/\.?0+$/, '')}`);
	  } else {
		acc.push(`${key}=${value}`);
	  }
	}
	return acc;
  }, []);
  return normalizedData.join('&');
}

// First, normalize the request content:
// Take the timestamp of the request
// Concatenate it with the request method and request path
// If the request body is not empty, concatenate the request body json by stringifying the json body.
// Like this: 1649920583000POST/v1/order{"symbol": "SPOT_NEAR_USDC", "order_type": "LIMIT", "order_price": 15.23, "order_quantity": 23.11, "side": "BUY", "signature": "fc3c41d988dd03a65a99354a7b1d311a43de6b7a7867bdbdaf228bb74a121f8e47bb15ff7f69eb19c96da222f651da53b5ab30fb7caf69a76f01ad9af06c154400"}
export function normalizeRequestContent(timestamp: number, method: string, path: string, body: any) {
  let normalizedBody = body ? JSON.stringify(body) : '';
  return `${timestamp}${method}${path}${normalizedBody}`;
}

export const isValidNS = (value: string|number) => {
    if(typeof value === 'number') value = value.toString(); 
    return !isNaN(Number(value));
};

export const isValidAndPositiveNS = (value: string|number) => {
    if(typeof value === 'number') return value > 0;
    else return !isNaN(Number(value)) && Number(value) > 0;
}

export const tickToPrecision = (tick: number): number => {
	if(tick == undefined) return 0;
	if(tick == 0) return 0;
	return (tick >= 1 ? '..' : tick).toString().length - 2;
}

export const dollarFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	roundingMode: "floor",
} as any);