import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';
import { auth } from '../firebase'; // Import Firebase auth to logout and get user info
import { Box, Button, Heading, Text, VStack, HStack, Image } from '@chakra-ui/react';

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
        <Box maxW="4xl" mx="auto" p={4}>
            <HStack justify="space-between" align="center">
                <Heading as="h1" size="xl">Dashboard</Heading>
                <HStack>
                    <Link to="/createpost">
                        <Button colorScheme="green" mr={4}>
                            Create Post
                        </Button>
                    </Link>
                    <Button colorScheme="red" onClick={handleLogout}>
                        Logout
                    </Button>
                </HStack>
            </HStack>

            <VStack align="stretch" mt={8}>
                <Heading as="h2" size="lg" mb={4}>Posts</Heading>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Box
                            key={post.id}
                            p={4}
                            mb={4}
                            borderWidth={1}
                            borderColor="gray.300"
                            borderRadius="md"
                        >
                            <Heading as="h3" size="md">{post.title}</Heading>
                            <Text color="gray.700">{post.content}</Text>
                            {post.imageUrl && (
                                <Image
                                    src={post.imageUrl}
                                    alt="Post"
                                    mt={2}
                                    borderRadius="md"
                                    boxSize="full"
                                    objectFit="cover"
                                />
                            )}
                            <Text fontSize="sm" color="gray.500">
                                Posted by {post.authorEmail} on{' '}
                                {new Date(post.createdAt).toLocaleDateString()}
                            </Text>
                        </Box>
                    ))
                ) : (
                    <Text>No posts yet. Start by creating one!</Text>
                )}
            </VStack>
        </Box>
    );
};

export default Dashboard;
