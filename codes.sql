create database rocketneo;
use rocketneo;

create table users(
    id varchar(200) unique not null,
    username varchar(200) unique not null,
    email varchar(200) unique not null,
    password varchar(200) not null
)