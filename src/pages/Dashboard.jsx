import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';
import { auth } from '../firebase'; // Import Firebase auth to logout and get user info

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    // Fetch posts from Firebase Realtime Database
    useEffect(() => {
        const db = getDatabase();
        const postsRef = dbRef(db, 'posts');

        onValue(postsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const postList = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setPosts(postList);
            }
        });
    }, []);

    // Handle logout
    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/signin');
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div>
                    <Link
                        to="/createpost"
                        className="px-4 py-2 bg-green-500 text-white rounded-md mr-4"
                    >
                        Create Post
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Posts</h2>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="p-4 mb-4 border border-gray-300 rounded-md"
                        >
                            <h3 className="text-xl font-bold">{post.title}</h3>
                            <p className="text-gray-700">{post.content}</p>
                            {post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt="Post"
                                    className="mt-2 w-full h-64 object-cover rounded-md"
                                />
                            )}
                            <p className="text-sm text-gray-500">
                                Posted by {post.authorEmail} on{' '}
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No posts yet. Start by creating one!</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
