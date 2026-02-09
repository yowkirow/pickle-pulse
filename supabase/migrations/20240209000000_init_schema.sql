-- Core Schema for Pickle-Pulse

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tournaments Table
create type tournament_status as enum ('planning', 'active', 'completed');
create type tournament_format as enum ('single_elim', 'double_elim', 'round_robin');

create table tournaments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  status tournament_status default 'planning',
  format tournament_format not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Courts Table
create table courts (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid references tournaments(id) on delete cascade not null,
  name text not null,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Matches Table
create type match_status as enum ('scheduled', 'in_progress', 'finished');

create table matches (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid references tournaments(id) on delete cascade not null,
  court_id uuid references courts(id) on delete set null,
  status match_status default 'scheduled',
  player1_id uuid, -- Simplified for MVP (can link to a players table later)
  player2_id uuid,
  winner_id uuid,
  bracket_node_id text, -- Identifier for the bracket position
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Match Sets Table
create table match_sets (
  id uuid primary key default uuid_generate_v4(),
  match_id uuid references matches(id) on delete cascade not null,
  set_number int not null,
  p1_score int default 0,
  p2_score int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (match_id, set_number)
);

-- Enable Realtime for these tables
alter publication supabase_realtime add table tournaments, courts, matches, match_sets;
