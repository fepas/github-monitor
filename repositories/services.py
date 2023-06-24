from datetime import date, datetime, timedelta

import requests
from django.utils import timezone
from social_django.models import UserSocialAuth

from repositories.models import Commit, Repository


class GitHub:
    """
    Wrapper class for interacting with the GitHub API.
    """

    GITHUB_API_URL = 'https://api.github.com'
    NUMBER_OF_DAYS = 100

    def __init__(self, data):
        """
        Initialize the GitHub object.

        Args:
            data (dict): Data containing owner and name of the repository.
        """
        github_user = UserSocialAuth.objects.get(
            user__username=data["owner"], provider='github')
        token = github_user.extra_data["access_token"]
        self.repo_full_name = f'{data["owner"]}/{data["name"]}'
        self.repo_url = f'{self.GITHUB_API_URL}/repos/{self.repo_full_name}'
        self.commits_url = f'{self.repo_url}/commits'
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Accept': 'application/json'
        }

    def validate_repo(self):
        """
        Validate if the repository exists.

        Returns:
            bool: True if the repository exists, False otherwise.
        """
        response = requests.get(self.repo_url, headers=self.headers)
        return response.status_code == 200

    def fetch_commits_from_repo(self):
        """
        Fetch commits from the repository.

        Returns:
            list: List of created Commit objects.
        """
        last_day = date.today()
        first_day = last_day - timedelta(days=self.NUMBER_OF_DAYS)

        params = {
            'since': first_day.isoformat(),
            'until': last_day.isoformat()
        }
        commits = []
        page = 1

        while True:
            params['page'] = page
            fetched_commits = requests.get(
                self.commits_url, headers=self.headers, params=params).json()

            if not fetched_commits:  # No more commits
                break

            owner, name = self.repo_full_name.split('/')
            repo_obj = Repository.objects.get(owner=owner, name=name)

            for commit in fetched_commits:
                commit_obj = Commit.objects.create(
                    message=commit['commit']['message'],
                    sha=commit['sha'],
                    author=commit['commit']['author']['name'],
                    author_avatar=commit['author']['avatar_url'],
                    committer=commit['commit']['committer']['name'],
                    committer_avatar=commit['committer']['avatar_url'],
                    url=commit['commit']['url'],
                    date=timezone.make_aware(
                        datetime.strptime(
                            commit['commit']['author']['date'],
                            "%Y-%m-%dT%H:%M:%SZ")
                    ),
                    repository=repo_obj
                )
                commits.append(commit_obj)

            page += 1

        return commits
