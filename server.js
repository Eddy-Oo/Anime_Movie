const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const movies = [
  { 
    id: 1, 
    title: "Spirited Away", 
    year: 2001,
    photo: "https://wallpaperaccess.com/full/5472860.jpg",
    rating: 5,
    description: "Chihiro enters a magical bathhouse to rescue her parents from a witch's curse in this Studio Ghibli masterpiece."
  },
  { 
    id: 2, 
    title: "Your Name", 
    year: 2016,
    photo: "https://wallpapers.com/images/hd/makoto-shinkai-your-name-poster-yd4rjkxb6z58fxgs.jpg",
    rating: 4.5,
    description: "Two teenagers mysteriously swap bodies and form a connection across time in this visually stunning romance."
  },
  { 
    id: 3, 
    title: "Akira", 
    year: 1988,
    photo: "https://image.tmdb.org/t/p/original/3WhkpPvTIE8Hqp50bcKbdhDEKrm.jpg",
    rating: 4,
    description: "A biker gang leader navigates a cyberpunk Neo-Tokyo to save his friend from government experiments."
  }
];

let reviews = [
  {
    id: "1",
    name: "GhibliFan",
    text: "Spirited Away's bathhouse world is endlessly creative. No-Face remains one of anime's most fascinating characters.",
    date: "2023-05-15"
  },
  {
    id: "2",
    name: "ShinkaiLover",
    text: "Your Name's comet scene is the most beautiful animation I've ever seen. The emotional payoff destroyed me.",
    date: "2023-06-22"
  },
  {
    id: "3",
    name: "CyberOtaku",
    text: "Akira's motorcycle chase set the standard for anime action. The psychic powers escalation is mind-blowing.",
    date: "2023-04-10"
  },
  {
    id: "1",
    name: "MiyazakiStan",
    text: "Haku's dragon form is peak character design. The train sequence over water is pure magic.",
    date: "2023-07-30"
  }
];

app.get('/', (req, res) => {
  res.render('index', { 
    movies,
    pageTitle: "Top Anime Films" 
  });
});

app.get('/review/:movieId', (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const movie = movies.find(m => m.id === movieId);
  
  if (!movie) {
    return res.status(404).render('404', { message: 'Anime not found' });
  }
  
  res.render('review', { 
    movie,
    pageTitle: `Review ${movie.title}`
  });
});

app.post('/submit-review', (req, res) => {
  const { movieId, name, review } = req.body;
  const movie = movies.find(m => m.id === parseInt(movieId));
  
  if (movie) {
    const newReview = {
      id: movieId,
      name: name || "Anonymous Otaku",
      text: review,
      date: new Date().toLocaleDateString()
    };
    reviews.push(newReview);
    console.log('New review:', newReview);
  }
  
  res.redirect('/reviews');
});

app.get('/reviews', (req, res) => {
  const enhancedReviews = reviews.map(review => ({
    ...review,
    movie: movies.find(m => m.id === parseInt(review.id))
  }));
  
  res.render('reviews', { 
    reviews: enhancedReviews,
    movies,
    pageTitle: "All Reviews"
  });
});

app.use((req, res) => {
  res.status(404).render('404', { 
    message: 'Studio Ghibli couldn\'t find this page',
    pageTitle: "404 Not Found"
  });
});

app.use((err, req, res, next) => {
  console.error('Anime error:', err.stack);
  res.status(500).render('500', { 
    error: err,
    pageTitle: "Server Error" 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✨ Anime Review Server running at http://localhost:${PORT}`);
  console.log('Featured Films:');
  movies.forEach(movie => {
    console.log(`- ${movie.title} (${movie.year})`);
  });
});
