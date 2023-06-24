from django.urls import path

from .views import CommitListView, RepositoryListCreateView

app_name = 'repositories'

urlpatterns = [
    path('api/commits/', CommitListView.as_view(), name='commits-list'),
    path('api/repositories/', RepositoryListCreateView.as_view(),
         name='repositories-create'),
]
