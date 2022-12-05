from django.contrib import admin

from .models import Book, Author, Category


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title',)


@admin.register(Author)
class AuthorsAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
