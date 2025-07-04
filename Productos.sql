CREATE TABLE categories (
    id bigint primary key generated always as identity,
    name text not null,
    description text
);

CREATE TABLE companies (
    id bigint primary key generated always as identity,
    name text not null,
    address text,
    phone text
);

CREATE TABLE products (
    id bigint primary key generated always as identity,
    name text not null,
    price numeric(10, 2) not null,
    stock integer not null default 0,
    description text,
    category_id bigint references categories(id),
    company_id bigint references companies(id)
);