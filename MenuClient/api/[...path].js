const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD']);

function normalizeApiOrigin() {
  const rawValue =
    globalThis.process?.env?.API_ORIGIN?.trim() ||
    globalThis.process?.env?.VITE_API_BASE_URL?.trim() ||
    '';

  return rawValue.replace(/\/+$/, '').replace(/\/api$/, '');
}

function appendQueryParams(url, query = {}) {
  for (const [key, value] of Object.entries(query)) {
    if (key === 'path' || value == null) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => url.searchParams.append(key, String(entry)));
      continue;
    }

    url.searchParams.append(key, String(value));
  }
}

function buildUpstreamUrl(apiOrigin, path = [], query = {}) {
  const pathSegments = Array.isArray(path) ? path : [path].filter(Boolean);
  const upstreamUrl = new URL(`/api/${pathSegments.join('/')}`, `${apiOrigin}/`);
  appendQueryParams(upstreamUrl, query);
  return upstreamUrl;
}

function buildRequestBody(req) {
  if (METHODS_WITHOUT_BODY.has(String(req.method ?? 'GET').toUpperCase())) {
    return undefined;
  }

  if (req.body == null || req.body === '') {
    return undefined;
  }

  if (typeof req.body === 'string' || globalThis.Buffer?.isBuffer(req.body)) {
    return req.body;
  }

  return JSON.stringify(req.body);
}

export default async function handler(req, res) {
  const apiOrigin = normalizeApiOrigin();

  if (!apiOrigin) {
    return res.status(500).json({
      message: 'API_ORIGIN is not configured for this deployment.',
    });
  }

  const upstreamUrl = buildUpstreamUrl(apiOrigin, req.query?.path, req.query);
  const requestHeaders = {};

  if (req.headers.authorization) {
    requestHeaders.authorization = req.headers.authorization;
  }

  if (req.headers['content-type']) {
    requestHeaders['content-type'] = req.headers['content-type'];
  }

  let upstreamResponse;

  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: req.method,
      headers: requestHeaders,
      body: buildRequestBody(req),
    });
  } catch {
    return res.status(502).json({
      message: 'Unable to reach the backend API.',
    });
  }

  const contentType = upstreamResponse.headers.get('content-type');
  if (contentType) {
    res.setHeader('content-type', contentType);
  }

  const cacheControl = upstreamResponse.headers.get('cache-control');
  if (cacheControl) {
    res.setHeader('cache-control', cacheControl);
  }

  const body = globalThis.Buffer.from(await upstreamResponse.arrayBuffer());
  return res.status(upstreamResponse.status).send(body);
}
