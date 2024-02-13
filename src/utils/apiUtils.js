/**
 * A cleaner way to use the fetch API that does not involve any kind of nesting.
 * It takes the regular params of a fetch API and returns an array with data and error.
 * If the second element, error, is undefined, it means the API call is successful, and you can use the data.
 * Otherwise, the error occured is sent in the returned array, and data remains undefined.
 * You can then use this error to handle the it.
 * **NOTE:** This is an async function, so make sure to use `await` while calling it.
 * @param {string} url the URL to call with the fetch API
 * @param {RequestInit} params the params that go inside the fetch API
 * @param {'json' | 'text'} resType (optional) this kind of response will be sent in the data element of the returned array. By default it is json, but can be changed to text.
 * @returns {Promise<any[]>} an array with two elements: the first being the data during a successful call, and the second being the error during an unsuccessful call.
 */
export async function cleanFetch(url, params, resType = "json") {
  let data, err;
  try {
    const response = await fetch(url, params);
    const result =
      resType === "json" ? await response.json() : await response.text();
    data = result;
  } catch (e) {
    err = e;
  }
  return [data, err];
}
