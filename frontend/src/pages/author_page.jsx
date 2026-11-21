import { FaArrowLeft, FaUser } from 'react-icons/fa';

export default function AuthorPage({ author, books, setPage, setSelectedBook }) {
  if (!author) return <p className="empty-msg">Загрузка...</p>;

  // Книги этого автора
  const authorBooks = books.filter(b => b.authors.some(a => a.id === author.id));

  return (
    <div>
      <button className="btn-back" onClick={() => setPage('catalog')}>
        <FaArrowLeft /> Назад в каталог
      </button>

      {/* Карточка автора */}
      <div className="author-hero">
        {author.photo_url ? (
          <img className="author-photo" src={author.photo_url} alt={author.full_name} />
        ) : (
          <div className="author-photo-placeholder">
            <FaUser size={50} color="#d95f3b" />
          </div>
        )}
        <div>
          <h1 className="author-name">{author.full_name}</h1>
          <p className="author-bio">{author.bio || 'Биография автора скоро появится.'}</p>
        </div>
      </div>

      {/* Книги автора */}
      <h2 className="section-title">Книги автора</h2>

      {authorBooks.length === 0 ? (
        <p className="empty-msg">Книги этого автора пока не добавлены.</p>
      ) : (
        <div className="book-grid">
          {authorBooks.map(book => (
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