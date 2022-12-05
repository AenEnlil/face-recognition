from django.db import models

from authentication.models import User


class Author(models.Model):
    name = models.CharField(max_length=120)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=120)

    def __str__(self):
        return self.name


class Comment(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    book = models.ForeignKey(
        "Book",
        on_delete=models.CASCADE,
        related_name="comments"
    )
    score = models.PositiveSmallIntegerField(
        choices=(
            (1, "★☆☆☆☆"),
            (2, "★★☆☆☆"),
            (3, "★★★☆☆"),
            (4, "★★★★☆"),
            (5, "★★★★★"),
        )
    )
    title = models.CharField(max_length=180)
    content = models.CharField(max_length=900)
    timestamp = models.DateField(auto_now_add=True)

    def __str__(self):
        return ", ".join((str(self.author), str(self.book)))

    class Meta:
        ordering = ["-timestamp"]
        unique_together = ("author", "book",)


class Book(models.Model):
    title = models.CharField(max_length=180)
    authors = models.ManyToManyField("Author", related_name="books")
    categories = models.ManyToManyField("Category", related_name="books")
    cover = models.ImageField(upload_to="book_covers")
    price = models.PositiveIntegerField()
    printed_year = models.PositiveSmallIntegerField()

    def __str__(self):
        authors = ", ".join([str(author) for author in self.authors.all()])
        return ", ".join((
            self.title,
            authors,
            str(self.printed_year)
        ))