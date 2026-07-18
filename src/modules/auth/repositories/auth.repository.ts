import db from "../../../config/db";


// ==============================
// FIND USER BY EMAIL
// ==============================
export const findUserByEmail = async (
  email: string
) => {

  const result = await db.query(
    `
      SELECT *
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0];

};


// ==============================
// FIND USER BY UUID
// ==============================
export const findUserByUuid = async (
  uuid: string
) => {

  const result = await db.query(
    `
      SELECT *
      FROM users
      WHERE uuid = $1
      LIMIT 1
    `,
    [uuid]
  );

  return result.rows[0];

};


// ==============================
// CREATE USER
// ==============================
export const createUser = async (
  data: any
) => {

  const {
    name,
    email,
    password,
    role_id,
  } = data;


  const result = await db.query(
    `
      INSERT INTO users
      (
        name,
        email,
        password,
        role_id
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4
      )
      RETURNING
        id,
        uuid,
        name,
        email,
        role_id
    `,
    [
      name,
      email,
      password,
      role_id,
    ]
  );


  return result.rows[0];

};



// ==============================
// CREATE GOOGLE USER
// ==============================
export const createGoogleUser = async (
  data: {
    name: string;
    email: string;
    avatar?: string;
    role_id: number;
  }
) => {


  const {
    name,
    email,
    role_id,
  } = data;


  const result = await db.query(
    `
      INSERT INTO users
      (
        name,
        email,
        password,
        role_id,
        is_google_user
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING
        id,
        uuid,
        name,
        email,
        role_id
    `,
    [
      name,
      email,
      "GOOGLE_LOGIN",
      role_id,
      true,
    ]
  );


  return result.rows[0];

};



// ==============================
// SAVE 2FA SECRET
// ==============================
export const save2FASecret = async (
  userUuid: string,
  secret: string
) => {


  await db.query(
    `
      UPDATE users
      SET two_factor_secret = $1
      WHERE uuid = $2
    `,
    [
      secret,
      userUuid
    ]
  );

};



// ==============================
// ENABLE 2FA
// ==============================
export const enable2FA = async (
  userUuid: string
) => {


  await db.query(
    `
      UPDATE users
      SET two_factor_enabled = true
      WHERE uuid = $1
    `,
    [
      userUuid
    ]
  );

};



// ==============================
// FIND ROLE BY NAME
// ==============================
export const findRoleByName = async (
  name: string
) => {


  const result = await db.query(
    `
      SELECT id, name
      FROM roles
      WHERE name = $1
      LIMIT 1
    `,
    [
      name
    ]
  );


  return result.rows[0];

};