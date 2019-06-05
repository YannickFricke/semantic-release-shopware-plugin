# Semantic Release Shopware Plugin

## About this project

With this project you can use semantic-release to release your Shopware plugin to the `Shopware Community Store`.

It will check if the given environment variables `SCS_USERNAME` and `SCS_PASSWORD` are set and publishes then then the given file to the store.

It will automatically perform some required steps for your plugin via the Shopware Store API.

Per Example:

* Requesting a review (to be done)

## Whats works currently?

Currently only the environment variables are checked that they are set and we try to gain an access token to validate the credentials.

The publish step needs to be done.
