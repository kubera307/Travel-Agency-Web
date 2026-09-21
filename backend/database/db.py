import sqlite3
from flask import g
from config import Config

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(str(Config.DB_PATH))
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA foreign_keys = ON;")
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def query_all(sql, params=()):
    db = get_db()
    cur = db.execute(sql, params)
    rows = cur.fetchall()
    return [dict(row) for row in rows]

def query_one(sql, params=()):
    db = get_db()
    cur = db.execute(sql, params)
    row = cur.fetchone()
    return dict(row) if row else None

def execute(sql, params=()):
    db = get_db()
    cur = db.execute(sql, params)
    db.commit()
    return cur

