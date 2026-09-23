/**
 * TRAVEL INDIA - DATABASE ABSTRACTION LAYER
 * Supports SQLite (via Node.js native node:sqlite for zero-dependency dev)
 * and PostgreSQL (via pg for production)
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const DB_CLIENT = process.env.DB_CLIENT || 'sqlite';
let dbInstance = null;

class DatabaseAdapter {
  constructor() {
    this.clientType = DB_CLIENT.toLowerCase();
    this.init();
  }

  init() {
    if (this.clientType === 'postgres') {
      try {
        const { Pool } = require('pg');
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        console.log('✅ Connected to PostgreSQL database');
      } catch (err) {
        console.error('❌ Failed to connect to PostgreSQL, falling back to SQLite:', err.message);
        this.clientType = 'sqlite';
        this.initSqlite();
      }
    } else {
      this.initSqlite();
    }
  }

  initSqlite() {
    const { DatabaseSync } = require('node:sqlite');
    const dbPath = path.resolve(
      __dirname,
      process.env.SQLITE_DB_PATH || 'travel_india.sqlite'
    );
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.sqliteDb = new DatabaseSync(dbPath);
    this.sqliteDb.exec('PRAGMA foreign_keys = ON;');
    this.sqliteDb.exec('PRAGMA journal_mode = WAL;');
    console.log(`✅ Connected to SQLite database at: ${dbPath}`);
  }

  /**
   * Execute raw DDL schema script
   */
  exec(sql) {
    if (this.clientType === 'postgres') {
      return this.pool.query(sql);
    }
    return this.sqliteDb.exec(sql);
  }

  /**
   * Universal parameterized SELECT returning all rows
   */
  all(sql, params = []) {
    if (this.clientType === 'postgres') {
      let pgSql = sql;
      let idx = 1;
      pgSql = pgSql.replace(/\?/g, () => `$${idx++}`);
      return this.pool.query(pgSql, params).then(res => res.rows);
    }

    try {
      const stmt = this.sqliteDb.prepare(sql);
      const rows = stmt.all(...params);
      // Convert null prototype to plain objects
      return rows.map(r => ({ ...r }));
    } catch (err) {
      console.error(`SQL Error in all(): ${err.message}\nQuery: ${sql}`);
      throw err;
    }
  }

  /**
   * Universal parameterized SELECT returning first row or null
   */
  get(sql, params = []) {
    const rows = this.all(sql, params);
    if (rows && typeof rows.then === 'function') {
      return rows.then(r => (r && r.length > 0 ? r[0] : null));
    }
    return rows && rows.length > 0 ? rows[0] : null;
  }

  /**
   * Universal parameterized INSERT / UPDATE / DELETE
   */
  run(sql, params = []) {
    if (this.clientType === 'postgres') {
      let pgSql = sql;
      let idx = 1;
      pgSql = pgSql.replace(/\?/g, () => `$${idx++}`);
      return this.pool.query(pgSql, params).then(res => ({
        changes: res.rowCount,
        lastInsertRowid: null
      }));
    }

    try {
      const stmt = this.sqliteDb.prepare(sql);
      const result = stmt.run(...params);
      return {
        changes: result.changes,
        lastInsertRowid: result.lastInsertRowid
      };
    } catch (err) {
      console.error(`SQL Error in run(): ${err.message}\nQuery: ${sql}`);
      throw err;
    }
  }

  /**
   * Run operations inside a transaction
   */
  transaction(fn) {
    if (this.clientType === 'postgres') {
      return (async () => {
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const res = await fn(client);
          await client.query('COMMIT');
          return res;
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      })();
    }

    this.sqliteDb.exec('BEGIN TRANSACTION;');
    try {
      const res = fn(this);
      this.sqliteDb.exec('COMMIT;');
      return res;
    } catch (e) {
      this.sqliteDb.exec('ROLLBACK;');
      throw e;
    }
  }
}

function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseAdapter();
  }
  return dbInstance;
}

module.exports = getDatabase();

