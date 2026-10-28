import apiClient from './apiClient';

// The callback API changed incompatibly (consent record and score summary, no PATCH step). A server that has not been
// updated yet would accept the new payload, keep only the name and number, and answer 201, so the page would say "received"
// for a lead saved without its consent record. The page therefore asks the server first and sends nothing unless
// GET /api/health reports this exact version (same number as HEALTH_CHECK_CALLBACK_API in server/routes/healthRoutes.js).
const CALLBACK_API_VERSION = 2;

/** Throws unless the server confirms it speaks the callback API version this page was built for. */
async function assertServerAcceptsCallbacks() {
  let response;
  try {
    response = await apiClient.get('/api/health');
  } catch {
    throw new Error('Could not confirm that the server accepts callback requests');
  }
  const body = response?.status === 200 && response.data && typeof response.data === 'object' ? response.data : null;
  if (!body || body.healthCheckCallback !== CALLBACK_API_VERSION) {
    throw new Error('The server does not accept callback requests of this version yet');
  }
}

const healthCheckService = {
  /**
   * Ask for a callback after a Financial Health Check-up. `payload` must come from buildLeadPayload (contact details,
   * consent and the score summary only; the amounts the person typed never reach this function).
   * First GET /api/health must report callback API version 2; if it does not, is unreachable or answers something unreadable,
   * this rejects and nothing is posted. Then POST /api/health-check  ->  201 { id }
   * Resolves only on HTTP 201; any other status or a network error rejects, so callers can never show a false success.
   */
  async submitCallback(payload) {
    await assertServerAcceptsCallbacks();
    const response = await apiClient.post('/api/health-check', payload);
    if (response.status !== 201) throw new Error('Callback request was not saved');
    return response.data?.data;
  },

  /**
   * Admin: list who took the health check
   * GET /api/health-check  ->  { total, totalPages, currentPage, entries }
   */
  async getAll(params = {}) {
    const response = await apiClient.get('/api/health-check', { params });
    const data = response.data?.data || {};
    return {
      entries: Array.isArray(data.entries) ? data.entries : [],
      total: data.total || 0,
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
    };
  },
};

export default healthCheckService;
