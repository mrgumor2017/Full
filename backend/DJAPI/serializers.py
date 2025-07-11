from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Category
from .models import Product


User = get_user_model()
# СЕРІАЛІЗАТОР ДЛЯ РЕЄСТРАЦІЇ
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone', 'photo']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Користувач з таким email вже існує.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Користувач з таким іменем вже існує.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


#СЕРІАЛІЗАТОР ДЛЯ JWT З ВХОДОМ ЧЕРЕЗ EMAIL АБО USERNAME
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get("username")  # username або email
        password = attrs.get("password")

        try:
            user = User.objects.get(Q(username=identifier) | Q(email=identifier))
        except User.DoesNotExist:
            raise serializers.ValidationError("Користувача не знайдено")

        if not user.check_password(password):
            raise serializers.ValidationError("Невірний пароль")

        # Проксування до стандартної перевірки
        data = super().validate({
            "username": user.username,
            "password": password
        })

        # Додаємо користувача
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'photo': user.photo.url if user.photo else None
        }

        return data


#СЕРІАЛІЗАТОР ДЛЯ КАТЕГОРІЙ
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


#СЕРІАЛІЗАТОР ДЛЯ КОРИСТУВАЧА
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'photo']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)  # Додаємо повний серіалізатор для категорії

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'category', 'created_at', 'updated_at']

