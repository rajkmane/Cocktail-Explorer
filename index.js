import express from "express";
import axios from "axios";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Search cocktail
app.get("/search", async (req, res) => {
  const cocktailName = req.query.name;

  if (!cocktailName) {
    return res.render("index", {
      error: "Please enter a cocktail name."
    });
  }

  try {
    const response = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/search.php",
      {
        params: {
          s: cocktailName
        }
      }
    );

    const cocktails = response.data.drinks;

    if (!cocktails) {
      return res.render("index", {
        error: "No cocktail found. Try another name."
      });
    }

    res.render("result", {
      cocktails: cocktails
    });

  } catch (error) {
    console.error("API Error:", error.message);

    res.status(500).render("index", {
      error: "Unable to connect to the cocktail API. Please try again."
    });
  }
});

// Random cocktail
app.get("/random", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );

    const cocktail = response.data.drinks[0];

    res.render("result", {
      cocktails: [cocktail]
    });

  } catch (error) {
    console.error("API Error:", error.message);

    res.status(500).render("index", {
      error: "Unable to retrieve a random cocktail."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});