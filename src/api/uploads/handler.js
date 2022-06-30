const ClientError = require('../../exceptions/ClientError');
const responseError = require('../../utils/responseError');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id: albumId } = request.params;
      this._validator.validateImageHeaders(cover.hapi.headers);

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

      this._albumsService.addCover(fileLocation, albumId);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }
}

module.exports = UploadsHandler;
