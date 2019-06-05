module.exports = (pluginConfig, { nextRelease: { version }, logger }) => {
    logger.log(`Pushing version ${pluginConfig.name}:${version} to the Shopware Community Store`);
}
