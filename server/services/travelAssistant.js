import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert travel assistant specializing in North East India tourism. You help travelers with:

1. Destination Recommendations: Suggest places in the 8 states (Assam, Meghalaya, Tripura, Mizoram, Manipur, Nagaland, Arunachal Pradesh, Sikkim)

2. Itinerary Planning: Create day-wise travel plans with:
   - Best routes and transportation
   - Time allocation for each place
   - Accommodation suggestions
   - Local food recommendations

3. Travel Information:
   - Best time to visit (weather, festivals)
   - How to reach (flights, trains, roads)
   - Required permits (especially for Arunachal Pradesh)
   - Local customs and etiquette

4. Practical Tips:
   - Budget estimates
   - Safety guidelines
   - What to pack
   - Local transportation

Keep responses concise, friendly, and actionable. Use bullet points for clarity. Always prioritize traveler safety and authentic experiences.`;

export async function getTravelAssistantResponse(userMessage) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️  Gemini API key not found, using fallback responses');
      return getFallbackResponse(userMessage);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I am your North East India travel expert, ready to help with destinations, itineraries, travel tips, and local insights. How can I assist you today?' }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error('AI Assistant Error:', error);
    console.log('Using fallback response instead');
    return getFallbackResponse(userMessage);
  }
}

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Best time to visit
  if (lowerMessage.includes('best time') || lowerMessage.includes('when to visit')) {
    return `**Best Time to Visit North East India:**

🌸 **March-May (Spring)**: Pleasant weather, blooming flowers
- Perfect for: Sikkim, Meghalaya, Arunachal Pradesh
- Temperature: 15-25°C

🌧️ **June-September (Monsoon)**: Heavy rainfall, lush greenery
- Best avoided for travel
- Meghalaya receives highest rainfall

🍂 **October-February (Autumn/Winter)**: Clear skies, festivals
- **Best overall season**
- Temperature: 10-20°C
- Perfect for all states

**Festival Season**: October-November (Durga Puja, Diwali, Hornbill Festival)`;
  }

  // How to reach
  if (lowerMessage.includes('how to reach') || lowerMessage.includes('how to get')) {
    return `**How to Reach North East India:**

✈️ **By Air:**
- Guwahati (Assam) - Main hub
- Bagdogra (near Sikkim)
- Imphal, Agartala, Dimapur

🚂 **By Train:**
- Guwahati Railway Station - Major junction
- Connected to Delhi, Kolkata, Mumbai

🚗 **By Road:**
- NH27, NH37 connect major cities
- Siliguri Corridor (Chicken's Neck) - Entry point

📋 **Important:**
- Inner Line Permit (ILP) required for Arunachal Pradesh, Nagaland, Mizoram
- Protected Area Permit (PAP) for some areas`;
  }

  // Itinerary planning
  if (lowerMessage.includes('itinerary') || lowerMessage.includes('plan') || lowerMessage.includes('days')) {
    return `**Sample 7-Day North East Itinerary:**

**Day 1-2: Guwahati & Shillong**
- Kamakhya Temple, Brahmaputra cruise
- Drive to Shillong (3 hrs)
- Elephant Falls, Ward's Lake

**Day 3: Cherrapunji**
- Living Root Bridges
- Nohkalikai Falls
- Seven Sisters Falls

**Day 4-5: Kaziranga**
- Jeep/Elephant safari
- Rhino spotting

**Day 6-7: Tawang (if time permits)**
- Tawang Monastery
- Sela Pass, Madhuri Lake

💡 **Tip**: Hire local guides for authentic experiences!`;
  }

  // Top attractions
  if (lowerMessage.includes('attraction') || lowerMessage.includes('places') || lowerMessage.includes('visit')) {
    return `**Top Attractions in North East India:**

🏔️ **Sikkim:**
- Tsomgo Lake, Nathula Pass
- Pelling, Yuksom

🌉 **Meghalaya:**
- Living Root Bridges
- Dawki River, Mawlynnong

🦏 **Assam:**
- Kaziranga National Park
- Majuli Island

🏔️ **Arunachal Pradesh:**
- Tawang Monastery
- Ziro Valley

🎭 **Nagaland:**
- Hornbill Festival (Dec)
- Kohima War Cemetery

Each state offers unique experiences!`;
  }

  // Weather
  if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
    return `**North East India Weather:**

🌡️ **Current Season Guide:**

**Winter (Nov-Feb)**: 5-15°C
- Cold in hills, pleasant in valleys
- Pack: Woolens, jackets

**Summer (Mar-May)**: 15-25°C
- Comfortable weather
- Pack: Light clothes, sunscreen

**Monsoon (Jun-Sep)**: 20-30°C
- Heavy rainfall, landslides common
- Not recommended for travel

**Best Weather**: October-April`;
  }

  // Default response
  return `I can help you with:

✈️ **Destination Recommendations**
📅 **Itinerary Planning**
🗺️ **Best Routes & Travel Tips**
🌤️ **Weather Information**
📍 **Top Attractions**
🎫 **Permits & Requirements**

What would you like to know about North East India?`;
}
