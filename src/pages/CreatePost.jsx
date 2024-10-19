import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, push } from 'firebase/database';
import { storage } from '../firebase'; // Firebase storage import
import { auth } from '../firebase'; // Firebase auth import for user details
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = '';

            // Upload image to Firebase Storage if one is provided
            if (image) {
                const imageRef = ref(storage, `images/${image.name}`);
                const snapshot = await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // Get current user info (auth.currentUser)
            const user = auth.currentUser;

            // Push post data to Firebase Realtime Database
            const db = getDatabase();
            const postsRef = dbRef(db, 'posts');
            const newPost = {
                title,
                content,
                imageUrl,
                authorId: user ? user.uid : 'anonymous',
                authorEmail: user ? user.email : 'anonymous',
                createdAt: Date.now(),
            };

            await push(postsRef, newPost);

            // Reset form
            setTitle('');
            setContent('');
            setImage(null);
            setLoading(false);
            alert('Post created successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                        rows="4"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Image (optional)</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Posting...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
