import { useSelector } from 'react-redux';
import {Navigate} from 'react-router-dom';
import Loader from '../layouts/Loader';

export default function ProtectedRoute ({children, isAdmin=false}) {
    //isAuthenticated is true authendicated(login) , isAuthenticated is false authendicated(logout / error)
    const { isAuthenticated, loading, user} = useSelector(state => state.authState)


    // Show loader while authentication state is loading
    if (loading) {
        return <Loader />;
    }

    //not login mean below navigate from react router dom
    // if(!isAuthenticated && !loading) {
    //     return <Navigate to="/login" />//navigate is useElement hook (JSX)
    // }

     // If not authenticated, redirect to login
     if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // if(isAuthenticated ) {
    //     return children;
    // }
    //above code is for all user can see the admin dashboard for protecting and taking to home page below code works well:
    // if(isAuthenticated) {
    //     if(isAdmin === true  && user?.role !== 'admin') {
    //         return <Navigate to="/" />
    //     }
    //     return children;
    // }
      // If user is not an admin and trying to access an admin page, redirect to home
      if (isAdmin && user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;

    // if(loading) {
    //     return <Loader/>
    // }


   
}