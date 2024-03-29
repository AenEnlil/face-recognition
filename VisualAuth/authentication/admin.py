from django.contrib import admin

from .models import User


@admin.register(User)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('email',)
