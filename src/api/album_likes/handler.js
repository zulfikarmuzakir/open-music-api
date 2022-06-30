const ClientError = require('../../exceptions/ClientError');
const responseError = require('../../utils/responseError');

class AlbumLikesHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;

    this.postAlbumLikesHandler = this.postAlbumLikesHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumLikesHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { albumId } = request.params;

      await this._albumsService.verifyAlbum(albumId);

      const isLike = await this._userAlbumLikesService.verifyLike(credentialId, albumId);
      if (isLike) {
        await this._userAlbumLikesService.deleteAlbumLike(credentialId, albumId);
      } else {
        await this._userAlbumLikesService.addAlbumLike(credentialId, albumId);
      }

      const message = isLike ? 'Berhasil batal menyukai' : 'Berhasil menyukai';

      const response = h.response({
        status: 'success',
        message,
      });
      response.code(201);
      return response;
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }

  async getAlbumLikesHandler(request, h) {
    const { albumId } = request.params;

    const { likes, dataSource } = await this._userAlbumLikesService.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.code(200);
    response.header('X-Data-Source', dataSource);
    return response;
  }
}

module.exports = AlbumLikesHandler;
