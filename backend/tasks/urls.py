from django.urls import path
from .views import TaskViewSet, CategoryViewSet, TagViewSet

urlpatterns = [
    path('', TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name='task-list'),
    path('<int:pk>/', TaskViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='task-detail'),
    path('categories/', CategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='category-list'),
    path('categories/<int:pk>/', CategoryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='category-detail'),
    path('tags/', TagViewSet.as_view({'get': 'list', 'post': 'create'}), name='tag-list'),
    path('tags/<int:pk>/', TagViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='tag-detail'),
]
