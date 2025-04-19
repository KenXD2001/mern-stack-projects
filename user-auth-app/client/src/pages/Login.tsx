import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const togglePassword = () => setShowPassword((prev) => !prev);

    const validateEmail = (email: string) => {
        const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!email) return '';
        if (!regex.test(email)) return 'Invalid email format';
        return '';
    };

    const validatePassword = (password: string) => {
        if (!password) return '';
        // if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        }
        if (name === 'password') {
            setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { email, password } = formData;

        // Validate email and password
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError,
            });
            setLoading(false);
            return;
        }

        if (!email || !password) {
            setError('Please fill in both fields');
            setLoading(false);
            return;
        }

        try {
            const dummyUser = {
                email: 'admin@demo.com',
                password: 'demo'
            };
            if (email === dummyUser.email && password === dummyUser.password) {
                console.log('Login successful');
                navigate('/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            console.error('Error logging in', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white border-2 rounded-xl w-[450px]">
            <h1 className="text-2xl font-bold text-center mb-4">Log In</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}

                {/* Password */}
                <div className="relative w-full">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <Icon
                        icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
                        width="24"
                        height="24"
                        onClick={togglePassword}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    />
                </div>
                {errors.password && <div className="text-red-600 text-sm">{errors.password}</div>}

                {/* Error message */}
                {error && <div className="text-red-600 text-sm">{error}</div>}

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        className="w-full py-2 bg-blue-100 text-blue-600 border border-blue-300 rounded hover:bg-blue-200 text-lg flex items-center justify-center gap-1 group transition-all duration-300"
                        onClick={() => navigate('/')}
                    >
                        <span>Sign Up</span>
                        <Icon
                            icon="lets-icons:user-add-duotone-line"
                            width="24"
                            height="24"
                            className="transform transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </button>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg flex items-center justify-center gap-1 group transition-all duration-300"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span>Logging In...</span>
                                <Icon
                                    icon="mdi:loading"
                                    width="24"
                                    height="24"
                                    className="animate-spin"
                                />
                            </>
                        ) : (
                            <>
                                <span>Login</span>
                                <Icon
                                    icon="solar:login-line-duotone"
                                    width="24"
                                    height="24"
                                    className="transform transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </>
                        )}
                    </button>
                </div>

                <div className="w-full text-end text-blue-600 hover:text-blue-700 cursor-pointer">
                    <p onClick={() => navigate('/forgot-password')}>
                        forgot password?
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
