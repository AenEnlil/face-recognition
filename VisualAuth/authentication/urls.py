
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, LogoutView, RegisterView, ProfileView, VisualAuthentication

urlpatterns = [
    path('refresh-token/', TokenRefreshView.as_view(), name='refresh_token'),
    path('login/', LoginView.as_view(), name='login'),
    path('visual-authentication/', VisualAuthentication.as_view(), name='visual_auth'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
]
