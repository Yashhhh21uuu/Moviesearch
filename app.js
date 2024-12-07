const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("index", { error: null, movie: null });
});

app.post("/search", async (req, res) => {
  const { movieTitle } = req.body;

  if (!movieTitle) {
    return res.render("index", { error: "Please enter a movie title.", movie: null });
  }

  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=2cfedfc5`
    );

    if (response.data.Response === "False") {
      console.error("Movie not found:", response.data.Error);
      return res.render("index", { error: "Movie not found. Please try another title.", movie: null });
    }

    // Render movie details if found
    res.render("index", { error: null, movie: response.data });
  } catch (err) {
    console.error("Error fetching movie data:", err);
    res.render("index", { error: "Something went wrong. Please try again later.", movie: null });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
