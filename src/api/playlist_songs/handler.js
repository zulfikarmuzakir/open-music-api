const ClientError = require('../../exceptions/ClientError');
const responseError = require('../../utils/responseError');

class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, validator, playlistSongActivitiesService) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    this._playlistSongActivitiesService = playlistSongActivitiesService;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
    this.getPlaylistSongActivitiesHandler = this.getPlaylistSongActivitiesHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const action = 'add';

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const playlistSongId = await this._playlistSongsService.addSongToPlaylist(playlistId, songId);
      await this._playlistSongActivitiesService.addPlaylistSongActivity({
        playlistId,
        songId,
        userId: credentialId,
        action,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          playlistSongId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }

  async getPlaylistSongHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const [playlistData, songs] = await Promise.all([
        this._playlistsService.getPlaylistById(id),
        this._playlistSongsService.getPlaylistSongs(id),
      ]);

      const playlist = {
        id: playlistData.id,
        name: playlistData.name,
        username: playlistData.username,
        songs,
      };

      return {
        status: 'success',
        data: {
          playlist,
        },
      };
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }

  async deletePlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const action = 'delete';

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistSongsService.deletePlaylistSong(playlistId, songId);
      await this._playlistSongActivitiesService.addPlaylistSongActivity({
        playlistId,
        songId,
        userId: credentialId,
        action,
      });

      return {
        status: 'success',
        message: 'lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }

  async getPlaylistSongActivitiesHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      const activities = await this._playlistSongActivitiesService.getPlaylistSongActivities(
        playlistId,
        credentialId,
      );
      return {
        status: 'success',
        data: {
          playlistId,
          activities,
        },
      };
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }
}

module.exports = PlaylistSongsHandler;
