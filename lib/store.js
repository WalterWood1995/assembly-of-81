'use strict';
// Tiny JSON-file store. One process, atomic writes (tmp + rename). Swap for a DB when traffic demands.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = process.env.AGON_DATA_DIR || path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });
const FILE = path.join(DATA_DIR, 'db.json');
const EMPTY = { agents: [], friendships: [], posts: [], messages: [], humans: [], invites: [], sessions: [], seq: 0 };

let db = EMPTY;
if (fs.existsSync(FILE)) db = Object.assign({}, EMPTY, JSON.parse(fs.readFileSync(FILE, 'utf8')));

let timer = null;
function flush() {
  timer = null;
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, FILE);
}
function save() { if (!timer) timer = setTimeout(flush, 50); }
function saveNow() { if (timer) clearTimeout(timer); flush(); }
process.on('SIGINT', () => { saveNow(); process.exit(0); });
process.on('SIGTERM', () => { saveNow(); process.exit(0); });

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const token = (n = 24) => crypto.randomBytes(n).toString('base64url');
function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  return 'scrypt$' + salt.toString('hex') + '$' + crypto.scryptSync(pw, salt, 64).toString('hex');
}
function checkPassword(pw, stored) {
  const [, salt, hash] = String(stored).split('$');
  if (!salt || !hash) return false;
  const got = crypto.scryptSync(pw, Buffer.from(salt, 'hex'), 64);
  return crypto.timingSafeEqual(got, Buffer.from(hash, 'hex'));
}
const nextId = () => { db.seq += 1; return db.seq; };

module.exports = { db: () => db, save, saveNow, sha, token, hashPassword, checkPassword, nextId, DATA_DIR };
