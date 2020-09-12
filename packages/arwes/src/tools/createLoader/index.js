/* eslint-env browser */

/**
 * Load a provided image by URL.
 * @param  {String} url
 * @return {Promise}
 */
export const loadImage = url => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = img.onabort = () => reject();
    img.src = url;
  });
};

/**
 * Load a provided sound by URL.
 * @param  {String} url
 * @return {Promise}
 */
export const loadSound = url => {
  return new Promise((resolve, reject) => {
    const sound = new Audio();
    sound.addEventListener('canplaythrough', () => resolve());
    sound.onerror = sound.onabort = () => reject();
    sound.src = url;
  });
};

export const loadVideo = url => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.addEventListener('canplaythrough', () => resolve());
    video.onerror = () => reject();
    const source = document.createElement('source');
    video.appendChild(source);
    source.src = url;
  });
};

/**
 * Create handler for loader functionalities.
 * @param  {Object} depencencies
 * @param  {Function} depencencies.loadImage
 * @param  {Function} depencencies.loadSound
 * @return {Object}
 */
export default depencencies => {
  const deps = {
    loadImage,
    loadSound,
    loadVideo,
    ...depencencies
  };
  return {
    /**
     * Load a list of image and audio resources.
     * @param  {Object} resources
     * @param  {String[]} resources.images
     * @param  {String[]} resources.sounds
     * @param  {Object} opts - Optional options.
     * @param  {Number} [opts.timeout=30000] - Maximum duration to load. If this time
     * is reached and resources are not loaded, the promise is rejected.
     * @return {Promise}
     */
    load: (resources, opts) => {
      const { images = [], sounds = [], videos = [] } = resources || {};
      const options = Object.assign(
        {
          timeout: 3000
        },
        opts
      );

      return new Promise((resolve, reject) => {
        setTimeout(reject, options.timeout);
        Promise.all([
          ...images.map(image => deps.loadImage(image)),
          ...sounds.map(sound => deps.loadSound(sound)),
          ...videos.map(video => deps.loadVideo(video))
        ]).then(resolve, reject);
      });
    }
  };
};
