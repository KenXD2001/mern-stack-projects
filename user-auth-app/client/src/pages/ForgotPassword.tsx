import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState('');

    const dummyEmail = 'admin@demo.com';
    const dummyOtp = '123456';

    const validateEmail = (value: string) => {
        if (!value) return 'Email is required';
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) return 'Invalid email format';
        return '';
    };

    const validateOtp = (value: string) => {
        if (!value) return 'OTP is required';
        if (!/^\d{6}$/.test(value)) return 'OTP must be 6 digits';
        return '';
    };

    const validatePassword = (value: string) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const startResendTimer = () => {
        setResendTimer(30);
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev === 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const checkUser = () => {
        const err = validateEmail(email);
        if (err) {
            setEmailError(err);
            return;
        }

        setLoading(true);
        setError('');
        setTimeout(() => {
            if (email === dummyEmail) {
                setStep(2);
                setOtpSent(true);
                startResendTimer();
            } else {
                setError('User with this email not found');
            }
            setLoading(false);
        }, 1000);
    };

    const resendOtp = () => {
        setOtp('');
        setOtpVerified(false);
        setOtpError('');
        startResendTimer();
        alert('OTP resent to your email!');
    };

    const verifyOtp = () => {
        const err = validateOtp(otp);
        if (err) {
            setOtpError(err);
            return;
        }

        setLoading(true);
        setError('');
        setTimeout(() => {
            if (otp === dummyOtp) {
                setOtpVerified(true);
                setStep(3);
            } else {
                setError('Invalid OTP');
            }
            setLoading(false);
        }, 1000);
    };

    const resetPassword = () => {
        const err = validatePassword(newPassword);
        if (err) {
            setPasswordError(err);
            return;
        }

        setLoading(true);
        setError('');
        setTimeout(() => {
            alert('Password reset successful!');
            navigate('/login');
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white border-2 rounded-xl w-[450px]">
            <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>

            {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

            {step === 1 && (
                <>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className={`w-full p-2 mb-1 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded`}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            const err = validateEmail(e.target.value);
                            setEmailError(e.target.value === '' ? '' : err);
                        }}
                    />
                    {emailError && <p className="text-red-500 text-xs mb-3">{emailError}</p>}
                    <button
                        onClick={checkUser}
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span>Checking...</span>
                                <Icon icon="mdi:loading" className="animate-spin" />
                            </>
                        ) : (
                            <>
                                <span>Search User</span>
                                <Icon icon="fluent:search-20-regular" />
                            </>
                        )}
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className={`w-full p-2 mb-1 border ${otpError ? 'border-red-500' : 'border-gray-300'} rounded`}
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value);
                            const err = validateOtp(e.target.value);
                            setOtpError(e.target.value === '' ? '' : err);
                        }}
                    />
                    {otpError && <p className="text-red-500 text-xs mb-3">{otpError}</p>}
                    <button
                        onClick={verifyOtp}
                        disabled={loading}
                        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2 mb-2"
                    >
                        {loading ? (
                            <>
                                <span>Verifying...</span>
                                <Icon icon="mdi:loading" className="animate-spin" />
                            </>
                        ) : (
                            <>
                                <span>Verify OTP</span>
                                <Icon icon="mdi:shield-key-outline" />
                            </>
                        )}
                    </button>

                    <button
                        onClick={resendOtp}
                        disabled={resendTimer > 0}
                        className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                </>
            )}

            {step === 3 && (
                <>
                    <input
                        type="password"
                        placeholder="Enter New Password"
                        className={`w-full p-2 mb-1 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded`}
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            const err = validatePassword(e.target.value);
                            setPasswordError(e.target.value === '' ? '' : err);
                        }}
                    />
                    {passwordError && <p className="text-red-500 text-xs mb-3">{passwordError}</p>}
                    <button
                        onClick={resetPassword}
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span>Resetting...</span>
                                <Icon icon="mdi:loading" className="animate-spin" />
                            </>
                        ) : (
                            <>
                                <span>Reset Password</span>
                                <Icon icon="mdi:check-decagram-outline" />
                            </>
                        )}
                    </button>
                </>
            )}
        </div>
    );
};

export default ForgotPassword;
