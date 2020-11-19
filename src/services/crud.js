
const baseUrl = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/`


/**
 * @param {String} endpoint
 * @returns Server response.
 */
export const get = async endpoint =>
    await (await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
    })).json()
