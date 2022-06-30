/* eslint-disable camelcase */
const mapDBToAlbum = ({
<<<<<<< HEAD
  id, name, year, created_at, updated_at,
=======
  id, name, year, cover,
>>>>>>> 5d0a068 (update)
}) => ({
  id,
  name,
  year,
<<<<<<< HEAD
  created_at,
  updated_at,
});

const mapDBToSong = ({
  id, title, year, performer, genre, duration, albumId, created_at, updated_at,
=======
  cover,
});

const mapDBToSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  created_at,
  updated_at,
>>>>>>> 5d0a068 (update)
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToAlbum, mapDBToSong };
