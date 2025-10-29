const axios = require("axios");

async function sendZeptoMail(to, subject, htmlbody) {
  try {
    const response = await axios.post(
      "https://api.zeptomail.com/v1.1/email",
      {
        from: {
          address: "noreply@greenexdelivery.com",
          name: "GreenEx Delivery",
        },
        to: [
          {
            email_address: { address: to },
          },
        ],
        subject,
        htmlbody,
      },
      {
        headers: {
          Authorization:
            "Zoho-enczapikey wSsVR611/BKkCK0slDylJehpnFhXD12iHB9+3lL17yL7T6qQ/Mdtw0XOAgKnFfEYRzJqFzpB9bogzRwB1zoGid0szg1WDyiF9mqRe1U4J3x17qnvhDzKX29elBOKLoMPzgxvmGFmEcAl+g==",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ ZeptoMail Email Sent:", response.data);
  } catch (error) {
    console.error(
      "❌ ZeptoMail API Error:",
      error.response?.data || error.message
    );
  }
}

module.exports = sendZeptoMail;
