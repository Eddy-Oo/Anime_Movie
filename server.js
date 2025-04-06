const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Enhanced sample data
const movies = [
  { 
    id: 1, 
    title: "Spirited Away", 
    year: 2001,
    image: "spirited-away.jpg",
    bgImage: "spirited-bg.jpg",
    rating: 5,
    description: "Hayao Miyazaki's masterpiece..."
  },
  { 
    id: 2, 
    title: "Your Name", 
    year: 2016,
    image: "your-name.jpg",
    bgImage: "your-name-bg.jpg",
    rating: 4.5,
    description: "Makoto Shinkai's romantic fantasy..."
  },
  { 
    id: 3, 
    title: "Akira", 
    year: 1988,
    image: "akira.jpg",
    bgImage: "akira-bg.jpg",
    rating: 4,
    description: "Katsuhiro Otomo's cyberpunk masterpiece..."
  }
];

let reviews = [];

// Routes
app.get('/', (req, res) => {
  res.render('index', { movies });
});

app.get('/review/:movieId', (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const movie = movies.find(m => m.id === movieId);
  
  if (!movie) {
    return res.status(404).render('404', { message: 'Movie not found' });
  }
  
  res.render('review', { movie });
});

app.post('/submit-review', (req, res) => {
  const { movieId, rating, reviewText } = req.body;
  const movie = movies.find(m => m.id === parseInt(movieId));
  
  if (movie) {
    reviews.push({
      movieId: movie.id,
      movieTitle: movie.title,
      rating: parseInt(rating),
      reviewText,
      date: new Date().toLocaleString()
    });
    console.log('New review submitted:', reviews[reviews.length - 1]);
  }
  
  res.redirect('/reviews');
});

app.get('/reviews', (req, res) => {
  // Enhance reviews with movie data
  const enhancedReviews = reviews.map(review => {
    const movie = movies.find(m => m.id === review.movieId);
    return { ...review, movie };
  });
  
  res.render('reviews', { 
    reviews: enhancedReviews,
    movies 
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { error: err });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available movies:', movies.map(m => m.title));
});