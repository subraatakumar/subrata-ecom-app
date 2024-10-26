import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, VStack } from '@chakra-ui/react';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState("");
    const [password, setPassword] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("")
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            console.error('Error signing in', error.message);
            setError(error.message)
        }
    };

    if (user) navigate('/');

    useEffect(() => {
        if (error.length > 0) {
            setTimeout(() => {
                setError("")
            }, 2000)
        }
    }, [error])

    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
            <Box bg="gray.100" p={10} borderRadius="lg">
                <Heading as="h2" size="lg" mb={4}>Sign In</Heading>
                <form onSubmit={handleSignIn}>
                    <VStack spacing={4} align="stretch">
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </FormControl>
                        <Button type="submit" colorScheme="blue" width="full">
                            Sign In
                        </Button>
                    </VStack>
                </form>
                <Text mt={4}>
                    Don't have an account? <Link to="/signup" style={{ color: 'blue.600' }}>Sign Up</Link>
                </Text>
                {error && <Text mt={4} color="red.600">{error}</Text>}
            </Box>
        </Box>
    );
};

export default SignIn;
