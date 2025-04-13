import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const BlogEditModal = ({ isOpen, onClose, BlogId, getPosts }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null); 
    const [catagory, setCatagory] = useState("");
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    
        if (BlogId?.image) {
            setImage(BlogId?.image);
        }
    }, [BlogId]);

    const handleSave = () => {
        setLoading(true);
        const data = {
            title: title || BlogId?.title,
            description: description || BlogId?.description,
            image: image || BlogId?.image, 
            catagory: catagory || BlogId?.catagory,
        };
        const headers = {
            'Authorization': `${token}`,
        };
        axios
            .put(baseUrl + `/posts/${BlogId?._id}`, data, { headers })
            .then((res) => {
                toast.success('Your Blog updated successfully', { position: 'top-right' });
                getPosts();
                onClose();
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                toast.error('Something went wrong', { position: 'top-right' });
                console.log(err);
            });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // Set the image preview as base64
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setImage(null); // Remove the image preview
    };

    return (
        <>
            <Toaster />
            {isOpen && (
                <div className="z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-md w-full max-w-lg">
                        <label className="block mb-2 font-bold text-gray-800">Edit Value:</label>
                        <input
                            type="text"
                            defaultValue={BlogId?.title}
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            className="border rounded-md p-2 w-full mb-4"
                        />
                        <textarea
                            type="text"
                            defaultValue={BlogId?.description}
                            placeholder="Descriptions..."
                            onChange={(e) => setDescription(e.target.value)}
                            className="border rounded-md p-2 w-full mb-4"
                        />
                        
                        {/* Image Preview Section */}
                        <div className="mb-4">
                            <label className="block mb-2 font-bold text-gray-800">Image</label>
                            {image ? (
                                <div className="relative mb-4">
                                    <img
                                        src={image}
                                        alt="Blog"
                                        className="w-full h-48 object-cover border-2 border-dashed border-gray-400"
                                    />
                                    <button
                                        onClick={handleImageRemove}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-48 border-2 border-dashed border-gray-400 flex justify-center items-center">
                                    <span className="text-gray-500">No image selected</span>
                                </div>
                            )}
                            {/* Show file input only when there is no image */}
                            {!image && (
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="mt-2 w-full border p-2 rounded-md"
                                />
                            )}
                        </div>
                        
                        {/* Category Selection */}
                        <select
                            name="catagory"
                            className="border rounded-md p-2 w-full mb-4"
                            defaultValue={BlogId?.catagory}
                            onChange={(e) => setCatagory(e.target.value)}
                        >
                            <option value="">Choose Category</option>
                            <option value="tech">Tech</option>
                            <option value="beauty">Beauty</option>
                            <option value="food">Food</option>
                            <option value="travel">Travel</option>
                            <option value="motivations">Motivations</option>
                            <option value="nature">Nature</option>
                            <option value="fashion">Fashion</option>
                            <option value="life style">Life Style</option>
                            <option value="bollywood">Bollywood</option>
                            <option value="hollywood">Hollywood</option>
                        </select>

                        {/* Save and Cancel Buttons */}
                        <div className="flex justify-end">
                            <button
                                className="bg-primaryColor text-white px-4 py-2 rounded-md mr-2"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BlogEditModal;
