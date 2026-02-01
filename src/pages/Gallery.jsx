import React, { useState, useEffect } from 'react';
import { galleryApi } from '../lib/api';
import { Plus, Edit, Trash2, Upload, X, Loader2, Image as ImageIcon, Search } from 'lucide-react';

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'events',
        tags: '',
        image: null,
    });

    useEffect(() => {
        fetchGallery();
    }, [filter, searchTerm]);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filter !== 'all') params.category = filter;
            if (searchTerm) params.search = searchTerm;
            
            const response = await galleryApi.getGalleryItems(params);
            setItems(response.data || response);
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
            alert('Failed to load gallery items');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            if (editingItem) {
                // Update without image
                const updateData = {
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    tags: formData.tags,
                };
                await galleryApi.updateGalleryItem(editingItem._id, updateData);
                alert('Gallery item updated successfully!');
            } else {
                // Create with image
                if (!formData.image) {
                    alert('Please select an image');
                    setUploading(false);
                    return;
                }

                const form = new FormData();
                form.append('image', formData.image);
                form.append('title', formData.title);
                form.append('description', formData.description);
                form.append('category', formData.category);
                form.append('tags', formData.tags);

                await galleryApi.uploadGalleryItem(form);
                alert('Gallery item uploaded successfully!');
            }
            
            setIsModalOpen(false);
            setEditingItem(null);
            resetForm();
            fetchGallery();
        } catch (error) {
            alert(error.message || 'Failed to save gallery item');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description || '',
            category: item.category,
            tags: item.tags.join(', '),
            image: null,
        });
        setSelectedImage(item.imageUrl);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        
        try {
            await galleryApi.deleteGalleryItem(id);
            alert('Gallery item deleted successfully!');
            fetchGallery();
        } catch (error) {
            alert(error.message || 'Failed to delete gallery item');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'events',
            tags: '',
            image: null,
        });
        setSelectedImage(null);
    };

    const openCreateModal = () => {
        setEditingItem(null);
        resetForm();
        setIsModalOpen(true);
    };

    const categories = ['all', 'events', 'projects', 'academic', 'community', 'other'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus size={20} />
                    Upload Image
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search gallery..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                                filter === cat
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                    <p className="text-gray-500 mb-4">Start by uploading your first image</p>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Upload size={20} />
                        Upload Image
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
                            <div className="relative h-48 bg-gray-200">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                                {item.description && (
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                )}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                                        {item.category}
                                    </span>
                                    <span>❤️ {item.likes}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                {editingItem ? 'Edit Gallery Item' : 'Upload New Image'}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingItem(null);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!editingItem && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                            required={!editingItem}
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            {selectedImage ? (
                                                <img src={selectedImage} alt="Preview" className="max-h-48 mx-auto rounded" />
                                            ) : (
                                                <div>
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                                    <p className="text-gray-600">Click to upload image</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            )}

                            {editingItem && selectedImage && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                                    <img src={selectedImage} alt="Current" className="max-h-48 rounded mx-auto" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
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
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="events">Events</option>
                                        <option value="projects">Projects</option>
                                        <option value="academic">Academic</option>
                                        <option value="community">Community</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="e.g. tech, innovation, 2024"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingItem(null);
                                        resetForm();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="animate-spin" size={18} />
                                            {editingItem ? 'Updating...' : 'Uploading...'}
                                        </span>
                                    ) : (
                                        editingItem ? 'Update Item' : 'Upload Image'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
