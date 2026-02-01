import React, { useState, useEffect } from 'react';
import { eventApi } from '../lib/api';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Loader2 } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: [],
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        maxSeats: '',
        posterImage: null,
        status: 'upcoming',
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventApi.getEvents();
            setEvents(response.data || response);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            alert('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const categories = e.target.value.split(',').map(cat => cat.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, category: categories }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', JSON.stringify(formData.category));
            formDataToSend.append('date', formData.date);
            formDataToSend.append('startTime', formData.startTime);
            formDataToSend.append('endTime', formData.endTime);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('maxSeats', formData.maxSeats);
            formDataToSend.append('status', formData.status);
            
            if (formData.posterImage) {
                formDataToSend.append('posterImage', formData.posterImage);
            }

            if (editingEvent) {
                await eventApi.updateEvent(editingEvent._id, formDataToSend);
                alert('Event updated successfully!');
            } else {
                await eventApi.createEvent(formDataToSend);
                alert('Event created successfully!');
            }
            setIsModalOpen(false);
            setEditingEvent(null);
            resetForm();
            fetchEvents();
        } catch (error) {
            alert(error.message || 'Failed to save event');
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            name: event.name,
            description: event.description,
            category: event.category,
            date: event.date.split('T')[0],
            startTime: event.startTime,
            endTime: event.endTime,
            location: event.location,
            maxSeats: event.maxSeats,
            posterImage: null,
            status: event.status || 'upcoming',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        
        try {
            await eventApi.deleteEvent(id);
            alert('Event deleted successfully!');
            fetchEvents();
        } catch (error) {
            alert(error.message || 'Failed to delete event');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: [],
            date: '',
            startTime: '',
            endTime: '',
            location: '',
            maxSeats: '',
            posterImage: null,
            status: 'upcoming',
        });
    };

    const openCreateModal = () => {
        setEditingEvent(null);
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={20} />
                    Create Event
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                            {event.posterImage && (
                                <div className="w-full h-48 overflow-hidden">
                                    <img 
                                        src={event.posterImage} 
                                        alt={event.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        event.status === 'live' ? 'bg-green-100 text-green-700' :
                                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {event.status?.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                
                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={16} />
                                        <span>{event.seatsAvailable} / {event.maxSeats} seats available</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-wrap mb-4">
                                    {event.category.map((cat, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                            {cat}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingEvent ? 'Edit Event' : 'Create New Event'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categories (comma-separated)</label>
                                <input
                                    type="text"
                                    value={formData.category.join(', ')}
                                    onChange={handleCategoryChange}
                                    placeholder="e.g. Technical, Cultural, Sports"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Poster Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFormData(prev => ({ ...prev, posterImage: e.target.files[0] }));
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {formData.posterImage && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Selected: {formData.posterImage.name}
                                    </p>
                                )}
                                {editingEvent?.posterImage && !formData.posterImage && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-2">Current poster:</p>
                                        <img 
                                            src={editingEvent.posterImage} 
                                            alt="Current poster" 
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Seats</label>
                                    <input
                                        type="number"
                                        name="maxSeats"
                                        value={formData.maxSeats}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="live">Live</option>
                                    <option value="expired">Expired</option>
                                </select>
                                <p className="mt-1 text-sm text-gray-500">
                                    Only "Live" events allow student registration
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingEvent(null);
                                        resetForm();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                >
                                    {editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
