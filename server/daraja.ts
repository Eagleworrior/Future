import axios from 'axios'; // You'll need to install axios: npm install axios

// Load environment variables
// Make sure you have dotenv configured in your server's entry point
// For example, in index-dev.ts: require('dotenv').config();

const darajaConsumerKey = process.env.DARAJA_CONSUMER_KEY;
const darajaConsumerSecret = process.env.DARAJA_CONSUMER_SECRET;

// A function to get the Daraja API access token
const getAccessToken = async () => {
  if (!darajaConsumerKey || !darajaConsumerSecret) {
    throw new Error('Daraja API credentials are not set in the environment variables.');
  }

  const auth = Buffer.from(`${darajaConsumerKey}:${darajaConsumerSecret}`).toString('base64');

  // This is a placeholder. You would make a real API call here.
  // try {
  //   const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
  //     headers: {
  //       Authorization: `Basic ${auth}`,
  //     },
  //   });
  //   return response.data.access_token;
  // } catch (error) {
  //   console.error('Error getting Daraja access token:', error);
  //   throw error;
  // }

  // For now, returning a dummy token
  return 'dummy_access_token';
};


// A function to verify the transaction status
export const verifyTransaction = async (transactionCode: string) => {
  const accessToken = await getAccessToken();

  // This is a placeholder for the transaction verification logic.
  // You would make a POST request to the Daraja Transaction Status API.
  console.log(`Verifying transaction ${transactionCode} with token ${accessToken}`);
  console.log('BusinessShortCode:', process.env.DARAJA_BUSINESS_SHORT_CODE);

  // try {
  //   const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query', {
  //     Initiator: 'YOUR_INITIATOR_NAME', // Get this from Safaricom documentation
  //     SecurityCredential: 'YOUR_SECURITY_CREDENTIAL', // Generate this from your cert
  //     CommandID: 'TransactionStatusQuery',
  //     TransactionID: transactionCode,
  //     PartyA: process.env.DARAJA_BUSINESS_SHORT_CODE, // Or the user's phone number
  //     IdentifierType: '4',
  //     ResultURL: 'YOUR_RESULT_URL', // A callback URL on your server
  //     QueueTimeOutURL: 'YOUR_TIMEOUT_URL', // A callback URL on your server
  //     Remarks: 'Verify Payment',
  //     Occasion: 'Verification',
  //   }, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   // The result will be sent to your ResultURL.
  //   // You need to handle the callback from Safaricom.
  //   return { success: true, message: 'Verification request sent.' };
  // } catch (error) {
  //   console.error('Error verifying transaction:', error);
  //   return { success: false, message: 'Failed to send verification request.' };
  // }

  // For now, returning a dummy success response for valid-looking codes
  if (transactionCode && transactionCode.length > 5) {
      return { success: true, message: 'Transaction verification initiated.' };
  } else {
      return { success: false, message: 'Invalid transaction code.' };
  }
};
