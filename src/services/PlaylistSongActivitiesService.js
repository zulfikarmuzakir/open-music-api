const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivity({
    playlistId, songId, userId, action,
  }) {
    const id = nanoid(16);
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
  }

  async getPlaylistSongActivities(playlistId, userId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
              FROM playlist_song_activities
              LEFT JOIN users ON users.id = playlist_song_activities.user_id
              LEFT JOIN songs ON songs.id = playlist_song_activities.song_id
              WHERE playlist_song_activities.playlist_id = $1 AND playlist_song_activities.user_id = $2`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Activities tidak ditemukan');
    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
