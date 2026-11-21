import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function Catalog({ books, setSelectedBook, setPage }) {
  const [search, setSearch] = useState('');

  // Поиск фильтрует книги прямо в браузере
  const filteredBooks = books.filter(book => {
    const titleMatch = book.title.toLowerCase().includes(search.toLowerCase());
    const authorMatch = book.authors
      .map(a => a.full_name.toLowerCase())
      .join(' ')
      .includes(search.toLowerCase());
    return titleMatch || authorMatch;
  });

  return (
    <div>
      {/* Баннер */}
      <div className="hero">
        <h1 className="hero-title">Читай. <span>Делись.</span> Вдохновляйся.</h1>
        <p className="hero-subtitle">Тысячи историй ждут своего читателя</p>

        <div className="search-box">
          <FaSearch />
          <input
            className="search-input"
            type="text"
            placeholder="Найти книгу или автора..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Книги */}
      {filteredBooks.length === 0 ? (
        <p className="empty-msg">Ничего не найдено. Попробуй изменить запрос.</p>
      ) : (
        <div className="book-grid">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => { setSelectedBook(book.id); setPage('book'); }}
            >
              <img
                src={book.cover_url || 'https://via.placeholder.com/200x300?text=Нет+обложки'}
                alt={book.title}
              />
              <h3 className="book-card-title">{book.title}</h3>
              <p className="book-card-author">{book.authors.map(a => a.full_name).join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}