import React, { useState } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const togglePassword = () => setShowPassword((prev) => !prev);

    const validateName = (name: string) => {
        const regex = /^[A-Za-z\s]{2,50}$/;

        if (!name) return '';
        if (!regex.test(name)) return 'Name must contain only letters and spaces';

        const wordCount = name.trim().split(/\s+/).length;
        if (wordCount < 2) return 'Name should be at least 2 words';

        return '';
    };

    const validateEmail = (email: string) => {
        const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!email) return '';
        if (!regex.test(email)) return 'Invalid email format';
        return '';
    };

    const validatePassword = (password: string) => {
        if (!password) return '';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'name') {
            setErrors((prev) => ({ ...prev, name: validateName(value) }));
        }
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

        const { name, email, password } = formData;

        // Validate name, email and password
        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (nameError || emailError || passwordError) {
            setErrors({
                name: nameError,
                email: emailError,
                password: passwordError,
            });
            setLoading(false);
            return;
        }

        if (!name || !email || !password) {
            setError('Please fill all the fields');
            setLoading(false);
            return;
        }

        // Demo user bypass
        if (name === 'Admin Demo' && email === 'admin@demo.com' && password === 'demo123') {
            console.log('Demo account created!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            console.log(response.data);
            navigate('/login');
        } catch (err) {
            console.error('Error signing up', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white border-2 rounded-xl w-[450px]">
            <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
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
                        onClick={() => navigate('/login')}
                    >
                        <span>Login</span>
                        <Icon
                            icon="solar:login-line-duotone"
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
                                <span>Creating Account...</span>
                                <Icon
                                    icon="mdi:loading"
                                    width="24"
                                    height="24"
                                    className="animate-spin"
                                />
                            </>
                        ) : (
                            <>
                                <span>Sign Up</span>
                                <Icon
                                    icon="lets-icons:user-add-duotone-line"
                                    width="24"
                                    height="24"
                                    className="transform transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
