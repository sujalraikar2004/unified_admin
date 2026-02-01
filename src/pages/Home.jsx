import React, { useState, useEffect } from 'react';
import { Users, Calendar, Image, TrendingUp, Activity, FileText } from 'lucide-react';
import { eventApi, galleryApi, registrationApi } from '../lib/api';

const Home = () => {
    const [stats, setStats] = useState({
        events: 0,
        gallery: 0,
        registrations: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [eventsRes, galleryRes] = await Promise.all([
                eventApi.getEvents().catch(() => ({ data: [] })),
                galleryApi.getGalleryItems({}).catch(() => ({ data: [] })),
            ]);

            setStats({
                events: (eventsRes.data || eventsRes).length,
                gallery: (galleryRes.data || galleryRes).length,
                registrations: 0,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Total Events', value: stats.events, icon: Calendar, color: 'bg-blue-500', change: '+12%' },
        { title: 'Gallery Items', value: stats.gallery, icon: Image, color: 'bg-purple-500', change: '+8%' },
        { title: 'Registrations', value: stats.registrations, icon: Users, color: 'bg-green-500', change: '+23%' },
        { title: 'Active Users', value: '2.4K', icon: Activity, color: 'bg-orange-500', change: '+5%' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <span className="flex items-center text-sm text-green-600 font-semibold">
                                <TrendingUp size={16} className="mr-1" />
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {loading ? '...' : stat.value}
                        </h3>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="text-indigo-600" />
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 pb-4 border-b">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar size={20} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">New event created</p>
                                <p className="text-sm text-gray-500">Tech Workshop 2024</p>
                            </div>
                            <span className="text-xs text-gray-400">2h ago</span>
                        </div>
                        <div className="flex items-start gap-4 pb-4 border-b">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Image size={20} className="text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Gallery image uploaded</p>
                                <p className="text-sm text-gray-500">Campus Event 2024</p>
                            </div>
                            <span className="text-xs text-gray-400">5h ago</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Users size={20} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">New team registered</p>
                                <p className="text-sm text-gray-500">Code Warriors</p>
                            </div>
                            <span className="text-xs text-gray-400">1d ago</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="text-indigo-600" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition group">
                            <Calendar className="h-8 w-8 text-gray-400 group-hover:text-indigo-600 mb-2" />
                            <p className="font-medium text-gray-700">Create Event</p>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group">
                            <Image className="h-8 w-8 text-gray-400 group-hover:text-purple-600 mb-2" />
                            <p className="font-medium text-gray-700">Upload Image</p>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition group">
                            <Users className="h-8 w-8 text-gray-400 group-hover:text-green-600 mb-2" />
                            <p className="font-medium text-gray-700">View Teams</p>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition group">
                            <FileText className="h-8 w-8 text-gray-400 group-hover:text-orange-600 mb-2" />
                            <p className="font-medium text-gray-700">Reports</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
