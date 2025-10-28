import { AlertCircle, CheckCircle, Clock, DollarSign, Home, Loader, Phone, PhoneOff, TrendingUp, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const VanessaVoiceAI = () => {
const [calls, setCalls] = useState([]);
const [activeCall, setActiveCall] = useState(null);
const [stats, setStats] = useState({
    total: 0,
    qualified: 0,
    notInterested: 0,
    callback: 0,
    doNotCall: 0
});

const [propertyOwners] = useState([
    { id: 1, name: 'John Smith', phone: '+1-555-0101', address: '123 Oak St, Atlanta, GA' },
    { id: 2, name: 'Sarah Johnson', phone: '+1-555-0102', address: '456 Pine Ave, Atlanta, GA' },
    { id: 3, name: 'Michael Brown', phone: '+1-555-0103', address: '789 Maple Dr, Atlanta, GA' },
    { id: 4, name: 'Emily Davis', phone: '+1-555-0104', address: '321 Elm Blvd, Atlanta, GA' },
    { id: 5, name: 'Robert Wilson', phone: '+1-555-0105', address: '654 Cedar Ln, Atlanta, GA' }
]);

const initiateCall = (owner) => {
    const call = {
    id: Date.now(),
    owner: owner,
    status: 'dialing',
    startTime: new Date(),
    duration: 0,
    outcome: null,
    notes: [],
    price: null,
    timing: null,
    condition: null,
    ownerStatus: null
    };

    setActiveCall(call);
    
    setTimeout(() => {
    setActiveCall(prev => ({ ...prev, status: 'connected' }));
    simulateConversation(call);
    }, 2000);
};

const simulateConversation = (call) => {
    const scenarios = [
    {
        outcome: 'qualified',
        notes: [
        'Owner confirmed they own the property',
        'Considering selling in 2-3 months',
        'Price range: $280k-$310k',
        'Property in good condition, minor repairs needed',
        'Motivated - job relocation'
        ],
        price: '$280k-$310k',
        timing: '2-3 months',
        condition: 'Good',
        ownerStatus: 'Owner-occupied',
        duration: 85
    },
    {
        outcome: 'notInterested',
        notes: [
        'Owner confirmed they own the property',
        'Not interested in selling at this time',
        'Recently renovated, planning to stay long-term'
        ],
        price: null,
        timing: null,
        condition: 'Excellent',
        ownerStatus: 'Owner-occupied',
        duration: 45
    },
    {
        outcome: 'callback',
        notes: [
        'Owner is interested but needs to discuss with spouse',
        'Requested callback next week',
        'Preliminary price range: $250k+'
        ],
        price: '$250k+',
        timing: 'TBD',
        condition: 'Unknown',
        ownerStatus: 'Owner-occupied',
        duration: 62
    },
    {
        outcome: 'doNotCall',
        notes: [
        'Owner requested to be removed from call list',
        'Not interested in any offers'
        ],
        price: null,
        timing: null,
        condition: null,
        ownerStatus: 'Unknown',
        duration: 28
    },
    {
        outcome: 'qualified',
        notes: [
        'Owner confirmed property ownership',
        'Ready to sell ASAP - inherited property',
        'Price range: $195k-$220k',
        'Property needs moderate repairs',
        'Highly motivated - estate settlement'
        ],
        price: '$195k-$220k',
        timing: 'ASAP',
        condition: 'Needs repairs',
        ownerStatus: 'Inherited',
        duration: 92
      }
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    let noteIndex = 0;
    const noteInterval = setInterval(() => {
    if (noteIndex < scenario.notes.length) {
        setActiveCall(prev => ({
        ...prev,
        notes: [...prev.notes, scenario.notes[noteIndex]]
        }));
        noteIndex++;
    }
    }, 2000);

    setTimeout(() => {
    clearInterval(noteInterval);
    endCall({
        ...call,
        ...scenario,
        endTime: new Date(),
        status: 'completed'
    });
    }, scenario.duration * 1000);
};

const endCall = (completedCall) => {
    setCalls(prev => [completedCall, ...prev]);
    setActiveCall(null);
    
    setStats(prev => ({
    total: prev.total + 1,
    qualified: prev.qualified + (completedCall.outcome === 'qualified' ? 1 : 0),
    notInterested: prev.notInterested + (completedCall.outcome === 'notInterested' ? 1 : 0),
    callback: prev.callback + (completedCall.outcome === 'callback' ? 1 : 0),
    doNotCall: prev.doNotCall + (completedCall.outcome === 'doNotCall' ? 1 : 0)
    }));
};

useEffect(() => {
    if (activeCall && activeCall.status === 'connected') {
    const interval = setInterval(() => {
        setActiveCall(prev => ({
        ...prev,
        duration: Math.floor((new Date() - prev.startTime) / 1000)
        }));
    }, 1000);
    return () => clearInterval(interval);
    }
}, [activeCall]);

const getOutcomeIcon = (outcome) => {
    switch(outcome) {
    case 'qualified': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'notInterested': return <XCircle className="w-5 h-5 text-gray-400" />;
    case 'callback': return <Clock className="w-5 h-5 text-blue-500" />;
    case 'doNotCall': return <AlertCircle className="w-5 h-5 text-red-500" />;
    default: return null;
    }
};

const getOutcomeColor = (outcome) => {
    switch(outcome) {
    case 'qualified': return 'bg-green-50 border-green-200';
    case 'notInterested': return 'bg-gray-50 border-gray-200';
    case 'callback': return 'bg-blue-50 border-blue-200';
    case 'doNotCall': return 'bg-red-50 border-red-200';
    default: return 'bg-gray-50 border-gray-200';
    }
};

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
    <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vanessa AI</h1>
            <p className="text-gray-600">Voice AI Acquisitions Agent - Demo Prototype</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">System Online</span>
            </div>
        </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600">Total Calls</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold text-green-600">{stats.qualified}</span>
            </div>
            <p className="text-sm text-gray-600">Qualified Leads</p>
        </div>
    
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">{stats.callback}</span>
            </div>
            <p className="text-sm text-gray-600">Callbacks</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-gray-400" />
            <span className="text-2xl font-bold text-gray-600">{stats.notInterested}</span>
            </div>
            <p className="text-sm text-gray-600">Not Interested</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-2xl font-bold text-red-600">{stats.doNotCall}</span>
            </div>
            <p className="text-sm text-gray-600">Do Not Call</p>
        </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Call</h2>
            
            {activeCall ? (
            <div className="space-y-4">
                <div className={`p-4 rounded-lg ${activeCall.status === 'dialing' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                    {activeCall.status === 'dialing' ? (
                        <Loader className="w-6 h-6 text-yellow-600 animate-spin" />
                    ) : (
                        <Phone className="w-6 h-6 text-green-600" />
                    )}
                    <div>
                        <p className="font-bold text-gray-900">{activeCall.owner.name}</p>
                        <p className="text-sm text-gray-600">{activeCall.owner.phone}</p>
                    </div>
                    </div>
                    <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{activeCall.duration}s</p>
                    <p className="text-xs text-gray-500">
                        {activeCall.status === 'dialing' ? 'Dialing...' : 'Connected'}
                    </p>
                    </div>
                </div>
                <p className="text-sm text-gray-600">{activeCall.owner.address}</p>
                </div>

                {activeCall.notes.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Conversation Notes:</p>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
                    {activeCall.notes.map((note, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{note}</p>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </div>
            ) : (
            <div className="text-center py-12">
                <PhoneOff className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No active call</p>
                <p className="text-sm text-gray-400 mt-1">Select a property owner to begin calling</p>
            </div>
            )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Property Owners</h2>
            <div className="space-y-3">
            {propertyOwners.map(owner => (
                <div 
                key={owner.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                    <p className="font-semibold text-gray-900">{owner.name}</p>
                    <p className="text-sm text-gray-600">{owner.phone}</p>
                    <p className="text-xs text-gray-500 mt-1">{owner.address}</p>
                    </div>
                    <button
                    onClick={() => initiateCall(owner)}
                    disabled={activeCall !== null}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeCall
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    >
                    <Phone className="w-4 h-4" />
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Call History</h2>
        {calls.length === 0 ? (
                <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No calls yet</p>
            <p className="text-sm text-gray-400 mt-1">Call history will appear here</p>
            </div>
        ) : (
            <div className="space-y-3">
            {calls.map(call => (
                <div 
                key={call.id}
                className={`p-4 border-2 rounded-lg ${getOutcomeColor(call.outcome)}`}
                >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                    {getOutcomeIcon(call.outcome)}
                    <div>
                        <p className="font-bold text-gray-900">{call.owner.name}</p>
                        <p className="text-sm text-gray-600">{call.owner.address}</p>
                    </div>
                    </div>
                    <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700 capitalize">
                        {call.outcome.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-xs text-gray-500">{call.duration}s</p>
                    </div>
                </div>

                {call.outcome === 'qualified' && (
                    <div className="grid grid-cols-4 gap-3 mb-3 mt-3">
                    {call.price && (
                        <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="text-sm font-semibold text-gray-900">{call.price}</p>
                        </div>
                        </div>
                    )}
                    {call.timing && (
                        <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Timing</p>
                            <p className="text-sm font-semibold text-gray-900">{call.timing}</p>
                        </div>
                        </div>
                    )}
                    {call.condition && (
                        <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Condition</p>
                            <p className="text-sm font-semibold text-gray-900">{call.condition}</p>
                        </div>
                        </div>
                    )}
                    {call.ownerStatus && (
                        <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="text-sm font-semibold text-gray-900">{call.ownerStatus}</p>
                        </div>
                        </div>
                    )}
                    </div>
                )}

                <div className="bg-white bg-opacity-60 rounded p-3 space-y-1">
                    {call.notes.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-700">{note}</p>
                    </div>
                    ))}
                </div>

                {call.outcome === 'qualified' && (
                    <button className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Transfer to Acquisitions Lead
                    </button>
                )}
                </div>
            ))}
            </div>
        )}
        </div>
    </div>
    </div>
);
};

export default VanessaVoiceAI;