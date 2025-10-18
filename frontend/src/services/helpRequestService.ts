/**
 * Help Request Service
 * Manages agent help requests stored in localStorage with polling support
 */

export interface HelpRequest {
  id: string;
  timestamp: number;
  question: string;
  status: 'pending' | 'answered';
  response?: string;
  resolvedAt?: number;
}

const STORAGE_KEY = 'agent_help_requests';
const POLL_INTERVAL = 500; // Poll every 500ms for admin response
const REQUEST_TIMEOUT = 120000; // 2 minute timeout

/**
 * Generate a unique ID for help requests
 */
function generateId(): string {
  return `help_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all help requests from localStorage
 */
export function getHelpRequests(): HelpRequest[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading help requests:', error);
    return [];
  }
}

/**
 * Save help requests to localStorage
 */
function saveHelpRequests(requests: HelpRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch (error) {
    console.error('Error saving help requests:', error);
  }
}

/**
 * Create a new help request
 */
export function createHelpRequest(question: string): HelpRequest {
  const request: HelpRequest = {
    id: generateId(),
    timestamp: Date.now(),
    question,
    status: 'pending',
  };

  const requests = getHelpRequests();
  requests.push(request);
  saveHelpRequests(requests);

  return request;
}

/**
 * Get a specific help request by ID
 */
export function getHelpRequest(id: string): HelpRequest | undefined {
  const requests = getHelpRequests();
  return requests.find(req => req.id === id);
}

/**
 * Answer a help request
 */
export function answerHelpRequest(id: string, response: string): boolean {
  const requests = getHelpRequests();
  const request = requests.find(req => req.id === id);

  if (!request) {
    console.error(`Help request ${id} not found`);
    return false;
  }

  request.status = 'answered';
  request.response = response;
  request.resolvedAt = Date.now();

  saveHelpRequests(requests);
  return true;
}

/**
 * Poll for an answer to a help request
 * Returns a promise that resolves when the request is answered or times out
 */
export function pollForResponse(requestId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkForResponse = () => {
      const request = getHelpRequest(requestId);

      if (!request) {
        reject(new Error('Help request not found'));
        return;
      }

      // Check if answered
      if (request.status === 'answered' && request.response) {
        resolve(request.response);
        return;
      }

      // Check for timeout
      const elapsed = Date.now() - startTime;
      if (elapsed >= REQUEST_TIMEOUT) {
        reject(new Error('Request timed out after 2 minutes. No admin response received.'));
        return;
      }

      // Continue polling
      setTimeout(checkForResponse, POLL_INTERVAL);
    };

    // Start polling
    checkForResponse();
  });
}

/**
 * Delete old resolved requests (older than 24 hours)
 * Call this periodically to prevent localStorage from growing too large
 */
export function cleanupOldRequests(): void {
  const requests = getHelpRequests();
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  const filtered = requests.filter(req => {
    // Keep pending requests
    if (req.status === 'pending') return true;

    // Keep recent answered requests
    if (req.resolvedAt && req.resolvedAt > oneDayAgo) return true;

    // Remove old answered requests
    return false;
  });

  if (filtered.length !== requests.length) {
    saveHelpRequests(filtered);
  }
}

/**
 * Get count of pending requests
 */
export function getPendingCount(): number {
  const requests = getHelpRequests();
  return requests.filter(req => req.status === 'pending').length;
}

/**
 * Clear all help requests (useful for development/testing)
 */
export function clearAllRequests(): void {
  localStorage.removeItem(STORAGE_KEY);
}
