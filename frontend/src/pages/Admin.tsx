import { useState, useEffect } from 'react';
import { Clock, MessageSquare, CheckCircle, AlertCircle, Tag, X } from 'lucide-react';
import {
  getHelpRequests,
  answerHelpRequest,
  cleanupOldRequests,
  getPendingCount,
  type HelpRequest,
} from '../services/helpRequestService';
import { getDiscount, clearDiscount, type Discount } from '../services/discountService';

const Admin = () => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [pendingCount, setPendingCount] = useState(0);
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);

  // Load requests and setup polling
  useEffect(() => {
    // Initial load
    loadRequests();

    // Cleanup old requests on mount
    cleanupOldRequests();

    // Poll for updates every 0.3 seconds
    const interval = setInterval(() => {
      loadRequests();
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const loadRequests = () => {
    const allRequests = getHelpRequests();
    // Sort: pending first, then by timestamp (newest first)
    const sorted = allRequests.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return b.timestamp - a.timestamp;
    });
    setRequests(sorted);
    setPendingCount(getPendingCount());

    // Load active discount
    setActiveDiscount(getDiscount());
  };

  const handleClearDiscount = () => {
    if (confirm('Are you sure you want to clear the active discount?')) {
      clearDiscount();
      setActiveDiscount(null);
    }
  };

  const handleAnswerSubmit = (requestId: string) => {
    const response = responses[requestId]?.trim();
    if (!response) {
      alert('Please enter a response');
      return;
    }

    const success = answerHelpRequest(requestId, response);
    if (success) {
      // Clear the input
      setResponses(prev => ({ ...prev, [requestId]: '' }));
      // Reload requests
      loadRequests();
    } else {
      alert('Failed to submit response');
    }
  };

  const handleResponseChange = (requestId: string, value: string) => {
    setResponses(prev => ({ ...prev, [requestId]: value }));
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Admin Panel</h1>
              <p className="text-gray-600 mt-1">Agent Help Requests</p>
            </div>
            <div className="flex items-center gap-6">
              {activeDiscount && (
                <div className="px-4 py-2 bg-green-50 border-2 border-green-500 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag className="text-green-600" size={18} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-green-700">
                          Active Discount: {activeDiscount.percentage}%
                        </span>
                        <button
                          onClick={handleClearDiscount}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                          title="Clear discount"
                        >
                          <X size={14} className="text-green-600" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">
                        Applied to all orders
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-orange-500" size={20} />
                  <span className="text-2xl font-semibold">{pendingCount}</span>
                </div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-2xl font-semibold">
                    {requests.length - pendingCount}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        {requests.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-400 mb-2">No Requests Yet</h2>
            <p className="text-gray-500">
              Agent help requests will appear here when the agent needs assistance.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map(request => (
              <div
                key={request.id}
                className={`bg-white rounded-lg border-2 shadow-sm transition-all ${
                  request.status === 'pending'
                    ? 'border-orange-400 shadow-orange-100'
                    : 'border-gray-200'
                }`}
              >
                {/* Request Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {request.status === 'pending' ? (
                        <AlertCircle className="text-orange-500" size={20} />
                      ) : (
                        <CheckCircle className="text-green-500" size={20} />
                      )}
                      <span
                        className={`text-sm font-semibold uppercase tracking-wide ${
                          request.status === 'pending'
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock size={16} />
                      {formatTimestamp(request.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Question */}
                <div className="px-6 py-5">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Agent Question
                    </h3>
                    <p className="text-lg text-gray-900 leading-relaxed">
                      {request.question}
                    </p>
                  </div>

                  {/* Response Section */}
                  {request.status === 'pending' ? (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Your Response
                      </h3>
                      <div className="flex gap-3">
                        <textarea
                          value={responses[request.id] || ''}
                          onChange={e => handleResponseChange(request.id, e.target.value)}
                          placeholder="Type your answer here..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                              handleAnswerSubmit(request.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAnswerSubmit(request.id)}
                          className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors self-start"
                        >
                          Send
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Press Cmd/Ctrl + Enter to send
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Your Response
                      </h3>
                      <p className="text-lg text-gray-900 leading-relaxed bg-green-50 px-4 py-3 rounded-lg">
                        {request.response}
                      </p>
                      {request.resolvedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Resolved {formatTimestamp(request.resolvedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
