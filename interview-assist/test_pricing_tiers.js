const axios = require('axios');

async function testPricingTiers() {
  try {
    const response = await axios.get('http://localhost:3000/api/pricing-tiers');
    console.log('Pricing tiers response:', response.data);

    // Test selecting a pricing tier
    const selectResponse = await axios.post('http://localhost:3000/api/select-tier', {
      tierId: '1', // Assuming '1' is the ID for the 5-minute trial
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Select tier response:', selectResponse.data);
  } catch (error) {
    console.error('Pricing tiers error:', error.response ? error.response.data : error.message);
  }
}

testPricingTiers();
