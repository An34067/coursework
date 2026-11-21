from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

# Create your models here.

class Author(models.Model):
    full_name = models.CharField(max_length=255, verbose_name="ФИО автора")
    bio = models.TextField(blank=True, null=True, verbose_name="Биография")
    photo_url = models.URLField(blank=True, null=True, verbose_name="Фото (ссылка)")
    birth_date = models.DateField(blank=True, null=True, verbose_name="Дата рождения")

    class Meta:
        verbose_name = "Автор"
        verbose_name_plural = "Авторы"

    def __str__(self):
        return self.full_name


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Название")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name


class Book(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Черновик"
        PUBLISHED = "published", "Опубликовано"
        ARCHIVED = "archived", "В архиве"

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="books", verbose_name="Категория")
    authors = models.ManyToManyField(Author, related_name="books", verbose_name="Авторы")
    title = models.CharField(max_length=255, verbose_name="Название книги")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    cover_url = models.URLField(blank=True, null=True, verbose_name="Обложка (ссылка)")
    language = models.CharField(max_length=5, default="ru", verbose_name="Язык")
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT, verbose_name="Статус")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Книга"
        verbose_name_plural = "Книги"

    def __str__(self):
        return self.title


class Chapter(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="chapters", verbose_name="Книга")
    number = models.PositiveIntegerField(verbose_name="Номер главы")
    title = models.CharField(max_length=255, blank=True, null=True, verbose_name="Название главы")
    content = models.TextField(verbose_name="Содержание")

    class Meta:
        verbose_name = "Глава"
        verbose_name_plural = "Главы"
        unique_together = ("book", "number")
        ordering = ["number"]

    def __str__(self):
        return f"Глава {self.number} - {self.book.title}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews", verbose_name="Пользователь")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="reviews", verbose_name="Книга")
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Оценка (1-5)"
    )
    text = models.TextField(blank=True, null=True, verbose_name="Текст отзыва")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        unique_together = ("user", "book")

    def __str__(self):
        return f"Отзыв от {self.user.username} на {self.book.title}"


class UserBookStatus(models.Model):
    class Status(models.TextChoices):
        WANT_TO_READ = "want_to_read", "Хочу прочитать"
        READING = "reading", "Читаю"
        FINISHED = "finished", "Прочитано"
        DROPPED = "dropped", "Брошено"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="library", verbose_name="Пользователь")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="statuses", verbose_name="Книга")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.WANT_TO_READ, verbose_name="Статус чтения")
    current_chapter = models.ForeignKey(Chapter, on_delete=models.SET_NULL, blank=True, null=True, verbose_name="Текущая глава")
    percent = models.DecimalField(max_digits=5, decimal_places=2, default=0, verbose_name="Прогресс (%)")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Статус чтения"
        verbose_name_plural = "Статусы чтения"
        unique_together = ("user", "book")

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"