const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'pokeflix_super_secret_jwt_key_2026_pikachu';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'pokeflix_super_secret_refresh_key_2026_charizard';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function register(req, res, next) {
  try {
    const { username, email, password, avatar_url } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const trimmedUsername = String(username).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    if (trimmedUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check for existing user
    const existingUser = db
      .prepare('SELECT id, username, email FROM users WHERE LOWER(username) = ? OR LOWER(email) = ?')
      .get(trimmedUsername.toLowerCase(), trimmedEmail);

    if (existingUser) {
      if (existingUser.email.toLowerCase() === trimmedEmail) {
        return res.status(409).json({ error: 'Email is already registered' });
      }
      return res.status(409).json({ error: 'Username is already taken' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const insertUserStmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, avatar_url)
      VALUES (?, ?, ?, ?)
    `);

    const result = insertUserStmt.run(
      trimmedUsername,
      trimmedEmail,
      passwordHash,
      avatar_url || null
    );

    const userId = Number(result.lastInsertRowid);

    // Generate tokens
    const token = jwt.sign(
      { id: userId, username: trimmedUsername, email: trimmedEmail },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO sessions (user_id, refresh_token, expires_at)
      VALUES (?, ?, ?)
    `).run(userId, refreshToken, expiresAt);

    // Set auth cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: userId,
        username: trimmedUsername,
        email: trimmedEmail,
        avatar_url: avatar_url || null,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, username, identifier, password } = req.body;
    const loginIdentifier = (email || username || identifier || '').toString().trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required' });
    }

    const user = db
      .prepare('SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?')
      .get(loginIdentifier.toLowerCase(), loginIdentifier.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO sessions (user_id, refresh_token, expires_at)
      VALUES (?, ?, ?)
    `).run(user.id, refreshToken, expiresAt);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }
}

function logout(req, res, next) {
  try {
    let userId = req.user ? req.user.id : null;

    if (!userId) {
      let token = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }

      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          userId = decoded.id;
        } catch (_) {
          // Ignore invalid token during logout
        }
      }
    }

    const refreshToken = req.body && req.body.refreshToken;

    if (refreshToken) {
      db.prepare('DELETE FROM sessions WHERE refresh_token = ?').run(refreshToken);
    } else if (userId) {
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return next(error);
  }
}

function me(req, res, next) {
  try {
    const user = db
      .prepare('SELECT id, username, email, avatar_url, created_at, updated_at FROM users WHERE id = ?')
      .get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
};
