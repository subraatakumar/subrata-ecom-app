import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, VStack } from '@chakra-ui/react';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log("Handle Signup Called")
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            console.error('Error signing up', error);
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
            <Box bg="gray.100" p={10} borderRadius="lg">
                <Heading as="h2" size="lg" mb={4}>Sign Up</Heading>
                <form onSubmit={handleSignUp}>
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
                            Sign Up
                        </Button>
                    </VStack>
                </form>
                <Text mt={4}>
                    Already have an account? <Link to="/signin" style={{ color: 'blue.600' }}>Sign In</Link>
                </Text>
            </Box>
        </Box>
    );
};

export default SignUp;
