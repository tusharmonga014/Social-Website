/**
 * Returns a customized url according to width and quality.
 * @param {String} mediaFileUrl  Original url.
 * @param {*} w_x Width for the file.
 * @param {*} q_auto Boolean value for fetching in auto quality.
 * @returns Customized url.
 */
export default function getCostumoizedUrl(mediaFileUrl, w_x, q_auto) {

    const splittedUrl = mediaFileUrl.split('/');
    const urlPartOfBeforeAddition = splittedUrl.slice(0, 6).join('/');

    let lowQualityAdditionInUrl = '/';
    if (w_x) lowQualityAdditionInUrl += w_x + (q_auto ? ',' : '');
    if (q_auto) lowQualityAdditionInUrl += 'q_auto';
    lowQualityAdditionInUrl += '/';

    const urlPartOfAfterAddition = splittedUrl.slice(7).join('/');
    const lowQualityUrl = urlPartOfBeforeAddition + lowQualityAdditionInUrl + urlPartOfAfterAddition;

    return lowQualityUrl;
}