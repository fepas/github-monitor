from rest_framework import serializers

from repositories.services import GitHub

from .models import Commit, Repository


class RepositorySerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        filter_conditions = dict(**attrs)
        instance_exists = Repository.objects.filter(
            **filter_conditions).exists()
        if instance_exists:
            raise serializers.ValidationError('Repository already exists.')

        github_integration = GitHub(attrs)
        if not github_integration.validate_repo():
            raise serializers.ValidationError('Repository does not exist.')

        return attrs

    def create(self, validated_data):
        instance = Repository.objects.create(**validated_data)

        github_integration = GitHub(validated_data)
        github_integration.fetch_commits_from_repo()

        return instance

    class Meta:
        model = Repository
        fields = ('name', 'owner')


class CommitSerializer(serializers.ModelSerializer):
    repository = serializers.StringRelatedField(many=False)

    class Meta:
        model = Commit
        fields = (
            'message',
            'sha',
            'author',
            'author_avatar',
            'committer',
            'committer_avatar',
            'url',
            'date',
            'repository',
        )
