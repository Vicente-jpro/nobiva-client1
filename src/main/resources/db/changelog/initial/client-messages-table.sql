--liquibase formatted sql
--changeset nobiva:initial-client-messages-table
CREATE TABLE client_messages (
    id UUID PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    subject VARCHAR(160) NOT NULL,
    description VARCHAR(5000) NOT NULL,
    status VARCHAR(20) NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error VARCHAR(500),
    next_attempt_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    published_at TIMESTAMP,
    processed_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_client_messages_status CHECK (status IN
        ('PENDENTE','PUBLICADO','PROCESSADO','FALHADO'))
);
CREATE INDEX idx_client_messages_pending
    ON client_messages(status, next_attempt_at, created_at);
CREATE INDEX idx_client_messages_email ON client_messages(lower(email));
--rollback DROP TABLE client_messages;
