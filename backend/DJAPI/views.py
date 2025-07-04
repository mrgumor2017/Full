from rest_framework.viewsets import ModelViewSet
from .models import Category
from .serializers import (
    CategorySerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from dj_rest_auth.views import PasswordResetView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

class CustomPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return six.text_type(user.pk) + six.text_type(timestamp) + six.text_type(user.is_active)

custom_token_generator = CustomPasswordResetTokenGenerator()

@method_decorator(csrf_exempt, name='dispatch')
class CsrfExemptPasswordResetView(PasswordResetView):
    pass

User = get_user_model()

import logging
logger = logging.getLogger(__name__)

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    def dispatch(self, request, *args, **kwargs):
        logger.warning(f"🚨 GoogleLoginView.dispatch triggered! Method = {request.method}")
        return super().dispatch(request, *args, **kwargs)
    def post(self, request):
        logger.debug("🔥 GoogleLoginView called")
        token = request.data.get("id_token")
        logger.debug(f"📥 Received token: {token}")

        if not token:
            logger.warning("🚫 No token provided")
            return Response({"error": "No token provided"}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                "735629438683-hu9s33dcfkokmutc8e9fnjvubl9rtkf6.apps.googleusercontent.com"
            )
            logger.info("✅ Token verified")
            logger.debug(f"idinfo: {idinfo}")
        except ValueError as e:
            logger.error("❌ Token verification failed", exc_info=True)
            return Response({"error": "Invalid token", "details": str(e)}, status=401)


        email = idinfo.get("email")
        if not email:
            return Response({"error": "Email not found in token"}, status=400)

        user, created = User.objects.get_or_create(email=email, defaults={
            "username": email.split("@")[0],
        })

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            }
        })




#JWT login через username або email
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


# CRUD категорій
class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


#Реєстрація користувача
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


#Отримати поточного користувача

class CurrentUserView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

