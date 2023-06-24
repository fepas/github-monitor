from unittest.mock import MagicMock, patch

from django.contrib.auth.models import User
from django.test import TestCase
from social_django.models import UserSocialAuth

from repositories.models import Commit, Repository
from repositories.services import GitHub


class GitHubTests(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create(username='testuser')

        # Create a UserSocialAuth object and associate it with the user
        UserSocialAuth.objects.create(
            user=self.user,
            provider='github',
            uid='github-user-id',
            extra_data={'access_token': 'your-access-token'}
        )

        # Create a test repository
        self.repository = Repository.objects.create(
            owner='testuser', name='testrepo')

    @patch('repositories.services.requests.get')
    def test_validate_repo_existing(self, mock_get):
        # Mock the response of requests.get to return a successful response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_get.return_value = mock_response

        # Create an instance of GitHub
        github = GitHub({'owner': 'testuser', 'name': 'testrepo'})

        # Call the validate_repo method
        result = github.validate_repo()

        # Assertions
        self.assertTrue(result)
        mock_get.assert_called_once_with(
            github.repo_url, headers=github.headers)

    @patch('repositories.services.requests.get')
    def test_fetch_commits_from_repo(self, mock_get):
        # Mock the response of requests.get to return sample data
        mock_response = MagicMock()
        mock_response.json.side_effect = [[
            {
                'sha': '12345',
                'commit': {
                    'message': 'Test commit',
                    'author': {
                        'name': 'Test Author',
                        'date': '2023-06-22T10:00:00Z'
                    },
                    'committer': {
                        'name': 'Test Committer'
                    },
                    'url': 'https://example.com/commit/12345'
                },
                'author': {
                    'avatar_url': 'https://example.com/avatar_author.jpg'
                },
                'committer': {
                    'avatar_url': 'https://example.com/avatar_committer.jpg'
                },
            }
        ], []]

        mock_get.return_value = mock_response

        # Create an instance of GitHub
        github = GitHub({'owner': 'testuser', 'name': 'testrepo'})

        # Call the fetch_commits_from_repo method
        commits = github.fetch_commits_from_repo()

        # Assertions
        self.assertEqual(len(commits), 1)
        self.assertIsInstance(commits[0], Commit)
        self.assertEqual(commits[0].message, 'Test commit')
        self.assertEqual(commits[0].sha, '12345')
        self.assertEqual(commits[0].author, 'Test Author')
        self.assertEqual(commits[0].author_avatar,
                         'https://example.com/avatar_author.jpg')
        self.assertEqual(commits[0].committer, 'Test Committer')
        self.assertEqual(commits[0].committer_avatar,
                         'https://example.com/avatar_committer.jpg')
        self.assertEqual(commits[0].url, 'https://example.com/commit/12345')
        self.assertEqual(commits[0].repository, self.repository)
