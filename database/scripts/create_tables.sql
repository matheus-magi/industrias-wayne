CREATE DATABASE IF NOT EXISTS industriaswayne;

USE industriaswayne;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    nome VARCHAR(50) NOT NULL,
    senha VARCHAR(20) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

CREATE TABLE inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(30) NOT NULL,
    quantidade INT NOT NULL,
    status VARCHAR(30) NOT NULL
);

create table historico(
    id int auto_increment primary key,
    usuario_id int not null,
    acao varchar(100) not null,
    item_id int not null,
    item_nome varchar(50) not null,
    data datetime default current_timestamp,
    
    foreign key (usuario_id) references usuarios(id)
)