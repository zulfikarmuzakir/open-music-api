const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike(userId, albumId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Menyukai gagal');
    await this._cacheService.delete(`albums:${albumId}`);

    return result.rows[0].id;
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`albums:${albumId}`);
      const dataSource = 'cache';
      const data = {
        likes: JSON.parse(result),
        dataSource,
      };

      return data;
    } catch (error) {
      const query = {
        text: 'SELECT count(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      const likes = Number(result.rows[0].count);
      await this._cacheService.set(`albums:${albumId}`, JSON.stringify(likes));
      const data = {
        likes,
        dataSource: 'database',
      };

      return data;
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new InvariantError('Batal menyukai gagal');
    await this._cacheService.delete(`albums:${albumId}`);
  }

  async verifyLike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) return false;

    return true;
  }
}

module.exports = UserAlbumLikesService;
