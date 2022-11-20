from django.contrib.auth import get_user_model, login, logout, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import UserSerializer
from .models import User


class LoginView(APIView):

    def post(self, request, *args, **kwargs):
        data = request.data
        user = authenticate(request, username=data['email'], password=data['password'])
        if user is not None:
            login(request, user)
            return Response({"success": 'logged in'}, 200)
        return Response({"error": 'invalid credentials'}, 400)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        logout(request)
        return Response({'success': 'logged out'}, 200)


class RegisterView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, 201)
