import { useState, useEffect } from 'react';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ReaderPage({ book, setPage }) {
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Ограничение ознакомительного фрагмента (например, первые 3 главы)
  const FREE_CHAPTERS_LIMIT = 3; 

  useEffect(() => {
    if (!book) return;
    fetch(`/api/books/${book.id}/chapters/`)
      .then(res => res.json())
      .then(data => {
        // Сортируем главы по номеру на всякий случай
        const sorted = data.data.sort((a, b) => a.number - b.number);
        setChapters(sorted);
        setLoading(false);
      });
  }, [book]);

  if (!book || loading) return <p className="empty-msg">Загрузка книги...</p>;
  if (chapters.length === 0) return <p className="empty-msg">В этой книге пока нет глав для чтения.</p>;

  const currentChapter = chapters[currentChapterIndex];
  const isLimitReached = currentChapterIndex >= FREE_CHAPTERS_LIMIT;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '50px', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
      
      <button className="btn-back" onClick={() => setPage('book')} style={{ marginBottom: '30px' }}>
        <FaArrowLeft /> Назад к книге
      </button>

      <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>{book.title}</h1>
        <h3 style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>{currentChapter.title || `Глава ${currentChapter.number}`}</h3>
      </div>

      {/* Текст главы */}
      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)', textAlign: 'justify', minHeight: '300px' }}>
        {isLimitReached ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg)', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '15px' }}>Конец ознакомительного фрагмента</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              Вы прочитали первые {FREE_CHAPTERS_LIMIT} глав. Чтобы читать дальше, приобретите полную версию книги.
            </p>
            <button className="btn btn-accent" onClick={() => setPage('catalog')}>Вернуться в каталог</button>
          </div>
        ) : (
          currentChapter.content.split('\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '20px', textIndent: '30px' }}>{paragraph}</p>
          ))
        )}
      </div>

      {/* Пагинация */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '50px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
        <button 
          className="btn btn-ghost" 
          disabled={currentChapterIndex === 0}
          onClick={() => setCurrentChapterIndex(prev => prev - 1)}
          style={{ opacity: currentChapterIndex === 0 ? 0.3 : 1 }}
        >
          <FaChevronLeft /> Предыдущая
        </button>

        <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
          Глава {currentChapter.number} из {chapters.length}
        </span>

        <button 
          className="btn btn-ghost" 
          disabled={currentChapterIndex === chapters.length - 1}
          onClick={() => setCurrentChapterIndex(prev => prev + 1)}
          style={{ opacity: currentChapterIndex === chapters.length - 1 ? 0.3 : 1 }}
        >
          Следующая <FaChevronRight />
        </button>
      </div>

    </div>
  );
}