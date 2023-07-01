const axios = require('axios');

async function LoginMobilax(email, password) {
  const loginUrl = 'https://www.mobilax.fr/api?model=Auth&action=connect&controller=Auth';
  const loginPayload = {
    email: email,
    password: password
  };

  try {
    const loginResponse = await axios.post(loginUrl, loginPayload);

    if (loginResponse.status === 200) {
      console.log("Login successful");
      const authToken = loginResponse.data.auth.token;
      return authToken;
    } else {
      console.log('Échec de la connexion.');
    }
  } catch (error) {
    console.log('An error occurred during login:', error.message);
  }
}

module.exports = {
    LoginMobilax
}