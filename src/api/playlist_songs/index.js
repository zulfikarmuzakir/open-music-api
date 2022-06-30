const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (
    server,
    {
      playlistSongsService, playlistsService, validator, playlistSongActivitiesService,
    },
  ) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongsService,
      playlistsService,
      validator,
      playlistSongActivitiesService,
    );

    server.route(routes(playlistSongsHandler));
  },
};
