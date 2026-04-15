import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        // Redirect based on role if trying to access unauthorized page
        if (user.role === 'admin') return <Navigate to="/admin" />;
        if (user.role === 'organizer') return <Navigate to="/organizer" />;
        return <Navigate to="/student" />;
    }

    return children;
};

export default PrivateRoute;
