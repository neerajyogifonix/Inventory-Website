import { useState, memo, useCallback, type FormEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../store/slices/userSlice';

function Login() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFormSubmit = useCallback((e: FormEvent) => {
        e.preventDefault(); 
        
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (email !== "admin@test.com" || password !== "admin1234") {
            alert('Invalid email or password');
            return;
        }

        const token = 'dummyToken';
        const userInfo = { name, email: email, password };
        console.log('Logging in with:', { name, email, password });
        dispatch(login({ token, userInfo }));
        
  
        navigate('/dashboard', { replace: true });
    }, [name, email, password, dispatch, navigate]);
    
  return (
    <div className='h-screen w-full flex justify-center items-center '>
        <div className='p-10 bg-white rounded-lg shadow-lg border-2 border-zinc-200'>
            <h2 className='text-2xl font-bold mb-6'>Login</h2>
            <form className='flex flex-col gap-4' onSubmit={handleFormSubmit}>
                <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)}  className='px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
                <input type="text" placeholder='email' onChange={(e) => setEmail(e.target.value)} className='px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
                <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} className='px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
                <button type="submit" className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default memo(Login)

