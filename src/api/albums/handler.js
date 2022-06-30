const ClientError = require('../../exceptions/ClientError');
const responseError = require('../../utils/responseError');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addAlbumHandler = this.addAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.editAlbumByIdHandler = this.editAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async addAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const albumId = await this._service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        data: {
          albumId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      const songs = await this._service.getAlbumSong(album.id);
      const albumWithSongs = {
        id: album.id,
        name: album.name,
        year: album.year,
<<<<<<< HEAD
        created_at: album.created_at,
        updated_at: album.updated_at,
=======
        coverUrl: album.cover,
>>>>>>> 5d0a068 (update)
        songs,
      };

      return {
        status: 'success',
        data: {
          album: albumWithSongs,
        },
      };
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }

  async editAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { id } = request.params;
      await this._service.editAlbumById(id, { name, year });
      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteNoteById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }
}

module.exports = AlbumsHandler;
