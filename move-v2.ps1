# Moves the v2 tag on GitHub to the latest commit.

git pull --tag
git push origin :refs/tags/v2
git tag -f v2
git push origin master --tags
