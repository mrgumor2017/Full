from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer
from rest_framework.permissions import AllowAny

# Create your views here.
class CategoryViewSet(ModelViewSet):
    print("get data")
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]