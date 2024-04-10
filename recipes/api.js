const path = require("path");
const express = require("express");
const router = express.Router();

// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);
router.get("/detail-client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./detail-client.js"))
);
router.get("/style.css", (_, res) =>
  res.sendFile(path.join(__dirname, "../style.css"))
);
router.get("/detail", (_, res) =>
  res.sendFile(path.join(__dirname, "./detail.html"))
);

/**
 * Student code starts here
 */
const pg = require("pg");
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "recipeguru",
  password: "lol",
  port: 5432,
});

router.get("/search", async function (req, res) {
  console.log("search recipes");

  const { rows } = await pool.query(
    `SELECT DISTINCT ON (r.recipe_id) 
      r.recipe_id, r.title, COALESCE(rp.url, 'default.jpg') AS url 
    FROM 
      recipes r 
    LEFT JOIN 
      recipes_photos rp 
    ON 
      r.recipe_id = rp.recipe_id;`
  );

  res.status(200).json({ rows });
});

router.get("/get", async (req, res) => {
  const recipeId = req.query.id ? +req.query.id : 1;
  console.log("recipe get", recipeId);

  const ingredientsPromise = pool.query(
    `
    SELECT
      i.title AS ingredient_title,
      i.image AS ingredient_image,
      i.type AS ingredient_type
    FROM
      recipe_ingredients ri
    INNER JOIN
      ingredients i
    ON
      i.id = ri.ingredient_id
    WHERE ri.recipe_id = $1;
  `,
    [recipeId]
  );

  const photosPromise = pool.query(
    `
    SELECT
      r.title, r.body, COALESCE(rp.url, 'default.jpg') AS url
    FROM
      recipes r
    LEFT JOIN
      recipes_photos rp
    ON
      rp.recipe_id = r.recipe_id
    WHERE
      r.recipe_id = $1;
  `,
    [recipeId]
  );

  const [photosResponse, ingredientsResponse] = await Promise.all([
    photosPromise,
    ingredientsPromise,
  ]);

  const photosRows = photosResponse.rows;
  const ingredientsRows = ingredientsResponse.rows;

  const photos = [];
  for (let i = 0; i < photosRows.length; i++) {
    photos.push(photosRows[i].url);
  }

  res.status(200).json({
    ingredients: ingredientsRows,
    photos,
    title: photosRows[0].title,
    body: photosRows[0].body,
  });
});
/**
 * Student code ends here
 */

module.exports = router;
