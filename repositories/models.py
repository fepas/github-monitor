from django.db import models


class Repository(models.Model):
    name = models.CharField(max_length=100)
    owner = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.owner}/{self.name}"

    class Meta:
        verbose_name_plural = 'Repositories'
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'owner'], name='unique_repository')
        ]


class Commit(models.Model):
    message = models.TextField()
    sha = models.CharField(max_length=100)
    author = models.CharField(max_length=50)
    author_avatar = models.URLField(max_length=200, blank=True)
    committer = models.CharField(max_length=50)
    committer_avatar = models.URLField(max_length=200, blank=True)
    url = models.URLField(max_length=200)
    date = models.DateTimeField()

    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    def __str__(self):
        return self.message

    class Meta:
        ordering = ('-date',)
