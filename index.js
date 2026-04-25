const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/recommend", async (req, res) => {
  const { neighbourhood, vibe } = req.body;

  try {
    const placesRes = await axios.post(
      "https://places.googleapis.com/v1/places:searchText",
      {
        textQuery: `restaurants in ${neighbourhood} Toronto`,
        maxResultCount: 10,
        languageCode: "en"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.reviews,places.googleMapsUri",
        },
      }
    );

    const places = placesRes.data.places || [];

    if (places.length === 0) {
      return res.json({ recommendations: [] });
    }

    const claudeRes = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: `You are a Toronto restaurant expert. Given a list of real restaurants and their reviews, pick the 3 best matches for the user's vibe. 
Return ONLY a valid JSON array with exactly 3 objects, no extra text, no markdown:
[
  {
    "name": "Restaurant Name",
    "address": "full address",
    "rating": 4.5,
    "priceLevel": "$$",
    "whyItMatches": "2-3 sentences explaining why this matches the vibe based on the reviews",
    "standoutDetail": "one specific thing from reviews that makes it special",
    "mapsUrl": "google maps url"
  }
]`,
        messages: [
          {
            role: "user",
            content: `Neighbourhood: ${neighbourhood}\nVibe: ${vibe}\n\nRestaurants:\n${JSON.stringify(places, null, 2)}`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
      }
    );

    const text = claudeRes.data.content[0].text;
    const recommendations = JSON.parse(text.replace(/```json|```/g, "").trim());
    res.json({ recommendations });

  } catch (err) {
    console.error(JSON.stringify(err?.response?.data || err.message, null, 2));
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3001, () => console.log("Backend running on port 3001"));
