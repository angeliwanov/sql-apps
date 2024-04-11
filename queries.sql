--Which movie made the most money?
SELECT name, revenue
FROM movies
ORDER BY COALESCE(revenue, 0) DESC
LIMIT 5;

SELECT name, revenue
FROM movies
ORDER BY revenue DESC NULLS LAST
LIMIT 5;


--How much revenue did the movies Keanu Reeves act in make?
SELECT SUM(movies.revenue)
FROM movies
JOIN casts ON movies.id = casts.movie_id
JOIN people ON people.id = casts.person_id
WHERE people.name = 'Keanu Reeves';

--Which 5 people were in the movies that had the most revenue?
SELECT people.name, SUM(movies.revenue) AS total_revenue
FROM movies
JOIN casts ON movies.id = casts.movie_id
JOIN people ON people.id = casts.person_id
GROUP BY people.name, people.id
ORDER BY SUM(movies.revenue) DESC NULLS LAST
LIMIT 5;


--Which 10 movies have the most keywords?
  SELECT movies.name, COUNT(categories.id)
  FROM movies
  JOIN movie_keywords on movies.id = movie_keywords.movie_id
  JOIN categories on movie_keywords.category_id = categories.id
  GROUP BY movies.id
  ORDER BY COUNT(categories.id) DESC
  LIMIT 10;


--Which category is associated with the most movies
SELECT categories.name, COUNT(movies.id)
FROM categories
JOIN movie_keywords on categories.id = movie_keywords.category_id
JOIN movies on movies.id = movie_keywords.movie_id
GROUP BY categories.id
ORDER BY COUNT(movies.id) DESC
LIMIT 10;
