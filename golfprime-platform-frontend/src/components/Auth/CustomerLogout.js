import axios from 'axios';

const CustomerLogout = async () => {
  try {
    await axios.post(
      'http://localhost:3000/auth/logout', 
      {}, 
      { withCredentials: true }
    );
    window.location.href = '/customer-login'; // Redirect to customer login page
  } catch (error) {
    console.error('Customer logout failed:', error);
  }
};

export default CustomerLogout;
