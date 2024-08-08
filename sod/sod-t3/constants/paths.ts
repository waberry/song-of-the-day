import path from 'path';

export const DATA_DIR = path.join(process.cwd(), 'data');
export const SEEDS_DIR = path.join(DATA_DIR, 'seeds');
export const MIGRATIONS_DIR = path.join(DATA_DIR, 'migrations');
export const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
export const TEMP_DIR = path.join(DATA_DIR, 'temp');
