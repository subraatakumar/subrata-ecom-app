import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

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
        <div className="flex justify-center items-center h-screen">
            <div className="bg-gray-100 p-10 rounded-lg">
                <h2 className="text-2xl mb-4">Sign Up</h2>
                <form onSubmit={handleSignUp}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2 border mb-4 w-full" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-2 border mb-4 w-full" required />
                    <button className="bg-blue-500 text-white p-2 w-full">Sign Up</button>
                </form>
                <p className="mt-4">
                    Already have an account? <Link to="/signin" className="text-blue-600">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
