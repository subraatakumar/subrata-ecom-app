import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="flex justify-center items-center h-screen">
            <div className="bg-gray-100 p-10 rounded-lg">
                <h2 className="text-2xl mb-4">Sign In</h2>
                <form onSubmit={handleSignIn}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2 border mb-4 w-full" required />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-2 border mb-4 w-full" required />
                    <button className="bg-blue-500 text-white p-2 w-full">Sign In</button>
                </form>
                <p className="mt-4">
                    Don't have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link>
                </p>
                <p className="mt-4 text-red-600">
                    {error}
                </p>
            </div>
        </div>
    );
};

export default SignIn;
