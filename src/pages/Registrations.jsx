import React, { useState, useEffect, useMemo } from 'react';

const Registrations = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDownload = () => {
        window.open('https://unified-backend-qxri.onrender.com/api/admin/registrations/download', '_blank');
    };

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await fetch('https://unified-backend-qxri.onrender.com/api/admin/registrations');

                if (!response.ok) {
                    throw new Error('Failed to fetch registration data.');
                }

                const data = await response.json();
                setEvents(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    const filteredEvents = useMemo(() => {
        return events.filter(event => 
            event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [events, searchTerm]);

    if (loading) {
        return <div className="text-center p-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Event Registrations</h1>
            
            <div className="mb-6 flex justify-between items-center">
                <input 
                    type="text"
                    placeholder="Search for events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Download as Excel
                </button>
            </div>

            <div className="space-y-8">
                {filteredEvents.map(event => (
                    <div key={event._id} className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">{event.name}</h2>
                        {event.registeredTeams.length > 0 ? (
                            <div className="space-y-6">
                                {event.registeredTeams.map(team => (
                                    <div key={team._id} className="border rounded-md p-4">
                                        <h3 className="text-xl font-bold text-gray-800">{team.teamName}</h3>
                                        <div className="mt-2">
                                            <p className="font-semibold">Leader: <span className="font-normal">{team.teamLeader ? `${team.teamLeader.fullName} (${team.teamLeader.email})` : 'Not specified'}</span></p>
                                        </div>
                                        <div className="mt-2">
                                            <h4 className="font-semibold">Members:</h4>
                                            <ul className="list-disc list-inside ml-4 mt-1">
                                                {team.members.map((member, index) => (
                                                    <li key={index}>{member.fullName} - {member.usn}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No teams have registered for this event yet.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Registrations;
