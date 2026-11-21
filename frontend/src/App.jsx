import { useState, useEffect } from 'react';
import AuthHeader from './components/auth_header';
import Catalog from './pages/catalog';
import BookPage from './pages/book_page';
import AuthorPage from './pages/author_page';
import AuthPage from './pages/auth_page';
import Profile from './pages/profile';
import ReaderPage from './pages/reader_page'; // <--- 1. ИМПОРТ

function App() {
  const [page, setPage] = useState('catalog');
  const [user, setUser] = useState(null);

  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    fetch('/api/current-user/', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { if (data.id) setUser(data); })
      .catch(() => {});

    fetch('/api/books/')
      .then(res => res.json())
      .then(data => setBooks(data.data));

    fetch('/api/authors/')
      .then(res => res.json())
      .then(data => setAuthors(data.data));
  }, []);

  const handleLogout = () => {
    fetch('/api/logout/', { method: 'POST', credentials: 'include' })
      .then(() => {
        setUser(null);
        setPage('catalog');
      });
  };

  const bookData = selectedBook ? books.find(b => b.id === selectedBook) : null;
  const authorData = selectedAuthor ? authors.find(a => a.id === selectedAuthor) : null;

  return (
    <div className="app">
      <AuthHeader user={user} setPage={setPage} onLogout={handleLogout} />

      <main className="container">
        {page === 'catalog' && (
          <Catalog books={books} setSelectedBook={setSelectedBook} setPage={setPage} />
        )}
        {page === 'book' && (
          <BookPage book={bookData} user={user} setPage={setPage} setSelectedAuthor={setSelectedAuthor} setSelectedBook={setSelectedBook} />
        )}
        {page === 'author' && (
          <AuthorPage author={authorData} books={books} setPage={setPage} setSelectedBook={setSelectedBook} />
        )}
        {page === 'auth' && (
          <AuthPage setUser={setUser} setPage={setPage} />
        )}
        {page === 'profile' && (
          <Profile user={user} books={books} setSelectedBook={setSelectedBook} setPage={setPage} />
        )}
        
        {/* 2. ДОБАВЛЯЕМ СТРАНИЦУ ЧИТАЛКИ */}
        {page === 'reader' && (
          <ReaderPage book={bookData} setPage={setPage} />
        )}
        
      </main>

      <footer className="footer">
        <h3 className="footer-title">BookHub</h3>
        <p className="footer-quote">Каждая книга - это целая вселенная. Выбирай свою.</p>
        <p>&copy; {new Date().getFullYear()} BookHub. Учебный проект.</p>
      </footer>
    </div>
  );
}

export default App;