from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, serializers, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Commit, Repository
from .serializers import CommitSerializer, RepositorySerializer


class RepositoryListCreateView(generics.ListCreateAPIView):
    serializer_class = RepositorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Repository.objects.filter(owner=str(self.request.user))
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
        except serializers.ValidationError:
            errors = dict(serializer.errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers=headers)


class CommitListView(generics.ListAPIView):
    serializer_class = CommitSerializer
    # permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'author': ['exact'],
        'committer': ['exact'],
        'repository__name': ['exact'],
    }

    filter_search_fields = ['message', 'author', 'committer']
    filter_order_fields = ['date']
    filter_ordering = ['-date']

    pagination_class = PageNumberPagination
    page_size = 10

    def get_queryset(self):
        queryset = Commit.objects.filter(repository__owner=self.request.user)
        queryset = self.filter_queryset(queryset)
        return queryset
