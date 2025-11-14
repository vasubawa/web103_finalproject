const pool = require('../db/pool')

const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  githubid bigint NOT NULL,
  username varchar(200) NOT NULL,
  avatarurl varchar(500),
  accesstoken varchar(500) NOT NULL
);
`

const createUsersTripsTableQuery = `
CREATE TABLE IF NOT EXISTS users_trips (
  id serial PRIMARY KEY,
  trip_id int NOT NULL,
  username text NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trips(id)
);
`


const createTripUser = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id)
    const { username } = req.body

    const results = await pool.query(
      `INSERT INTO users_trips (trip_id, username)
       VALUES($1, $2)
       RETURNING *`,
      [trip_id, username]
    )

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getTripUsers = async (req, res) => {
  try {
    const trip_id = parseInt(req.params.trip_id)
    const results = await pool.query(
      `SELECT * FROM users_trips WHERE trip_id = $1`,
      [trip_id]
    )
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getUserTrips = async (req, res) => {
  try {
    const username = req.params.username
    const results = await pool.query(
      `SELECT t.* FROM users_trips ut, trips t
       WHERE ut.trip_id = t.id AND ut.username = $1`,
      [username]
    )
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

module.exports = { createTripUser, getTripUsers, getUserTrips }
