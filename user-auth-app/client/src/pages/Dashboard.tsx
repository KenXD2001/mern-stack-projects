import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();

    // Sample KPIs
    const kpis = [
        {
            title: 'Total Users',
            value: '1,230',
            icon: 'mdi:account-group-outline',
            bgColor: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            title: 'Users Today',
            value: '35',
            icon: 'mdi:account-plus-outline',
            bgColor: 'bg-green-100',
            iconColor: 'text-green-600',
        },
    ];

    // Handle Logout
    const handleLogout = () => {
        setLoggingOut(true);
        // Simulate logout process (clear localStorage, etc.)
        setTimeout(() => {
            localStorage.removeItem('user');
            navigate('/login');
        }, 2000); // Simulating a 2-second logout delay
    };

    return (
        <div className="min-h-[90vh] bg-gray-50 p-6 flex justify-center rounded-xl">
            <div className="w-full max-w-5xl">
                {/* Heading */}
                <h1 className="text-3xl font-bold mb-6">
                    Welcome, <span className="text-blue-600">Ashwin</span> 👋
                </h1>

                {/* KPIs */}
                <div className="w-full px-4 mb-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                            {kpis.map((kpi, index) => (
                                <div
                                    key={index}
                                    className={`p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${kpi.bgColor}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${kpi.iconColor} bg-white`}>
                                            <Icon icon={kpi.icon} width="32" height="32" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-500">{kpi.title}</div>
                                            <div className="text-2xl font-bold">{kpi.value}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="">
                    <button
                        className="w-full py-2 bg-red-100 text-red-600 rounded hover:bg-red-400 hover:text-red-100 text-lg flex items-center justify-center gap-1 group transition-all duration-300 border-red-600 hover:border-red-600"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? (
                            <>
                                <span>Logging Out...</span>
                                <Icon
                                    icon="mdi:loading"
                                    width="24"
                                    height="24"
                                    className="animate-spin"
                                />
                            </>
                        ) : (
                            <>
                                <span>Logout</span>
                                <Icon
                                    icon="mdi:logout"
                                    width="24"
                                    height="24"
                                    className="transform transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
