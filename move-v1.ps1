# Moves the v1 tag on GitHub to the latest commit.

git pull --tag
git push origin :refs/tags/v1
git tag -f v1
git push origin master --tags
