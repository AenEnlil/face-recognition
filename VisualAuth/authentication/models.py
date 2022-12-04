from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.core.files.storage import default_storage
from django.db import models

from rest_framework_simplejwt.tokens import RefreshToken


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    face_image = models.ImageField(upload_to='face_image', blank=True, null=True)

    using_visual_authentication = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'

    objects = CustomUserManager()

    def create_tokens_for_user(self):
        token = RefreshToken.for_user(self)
        return {'refresh': str(token), 'access': str(token.access_token)}

    def check_if_face_image_added(self):
        if self.face_image:
            return True
        return False

    def delete_image(self, clear_field=False):
        if self.face_image:
            default_storage.delete(self.face_image.path)
            if clear_field:
                self.face_image = None
                self.using_visual_authentication = False
                self.save()
        return 'image deleted'
