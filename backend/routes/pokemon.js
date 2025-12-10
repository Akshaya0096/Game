import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/random-pokemon", async (req, res) => {
  try {
    const randomId = Math.floor(Math.random() * 151) + 1; // 1–151 classic Pokémon

    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`
    );

    const pokemon = {
      name: response.data.name,
      image: response.data.sprites.front_default,
      id: response.data.id,
      type: response.data.types[0].type.name,
    };

    res.json(pokemon);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Pokémon" });
  }
});

export default router;
