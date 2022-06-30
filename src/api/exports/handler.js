const ClientError = require('../../exceptions/ClientError');
const responseError = require('../../utils/responseError');

class ExportsHandler {
  constructor(exportsService, playlistsService, validator) {
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    try {
      this._validator.validateExportPlaylistPayload(request.payload);

      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { targetEmail } = request.payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      const message = {
        userId: credentialId,
        targetEmail,
        playlistId,
      };

      await this._exportsService.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (error) {
      return responseError(error, h, ClientError);
    }
  }
}

module.exports = ExportsHandler;
