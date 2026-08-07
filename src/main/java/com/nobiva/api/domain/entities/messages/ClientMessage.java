package com.nobiva.api.domain.entities.messages;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
@Entity
@Table(name = "client_messages")
public class ClientMessage {
    protected ClientMessage() { }
    @Id
    private UUID id;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(nullable = false, length = 160)
    private String subject;

    @Column(nullable = false, length = 5000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MessageStatus status;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "last_error", length = 500)
    private String lastError;

    @Column(name = "next_attempt_at")
    private LocalDateTime nextAttemptAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Version
    private long version;

    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getSubject() { return subject; }
    public String getDescription() { return description; }
    public MessageStatus getStatus() { return status; }
    public int getAttempts() { return attempts; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public LocalDateTime getProcessedAt() { return processedAt; }

    public static ClientMessage create(String email, String subject, String description) {
        ClientMessage message = new ClientMessage();
        message.id = UUID.randomUUID();
        message.email = email.trim().toLowerCase();
        message.subject = subject.trim();
        message.description = description.trim();
        message.status = MessageStatus.PENDENTE;
        message.attempts = 0;
        message.createdAt = LocalDateTime.now();
        message.updatedAt = message.createdAt;
        message.nextAttemptAt = message.createdAt;
        return message;
    }

    public void markPublished() {
        status = MessageStatus.PUBLICADO;
        publishedAt = LocalDateTime.now();
        updatedAt = publishedAt;
        lastError = null;
    }

    public void markProcessed() {
        if (status == MessageStatus.PROCESSADO) return;
        status = MessageStatus.PROCESSADO;
        processedAt = LocalDateTime.now();
        updatedAt = processedAt;
        lastError = null;
    }

    public void registerFailure(String error, int maxAttempts, long initialDelaySeconds) {
        attempts++;
        lastError = sanitizeError(error);
        updatedAt = LocalDateTime.now();
        if (attempts >= maxAttempts) {
            status = MessageStatus.FALHADO;
            nextAttemptAt = null;
        } else {
            status = MessageStatus.PENDENTE;
            long delay = initialDelaySeconds * (1L << Math.min(attempts - 1, 10));
            nextAttemptAt = updatedAt.plusSeconds(delay);
        }
    }

    public void registerProcessingFailure(String error, int maxAttempts) {
        attempts++;
        lastError = sanitizeError(error);
        updatedAt = LocalDateTime.now();
        status = attempts >= maxAttempts ? MessageStatus.FALHADO : MessageStatus.PUBLICADO;
    }

    public void resetForRetry() {
        if (status != MessageStatus.FALHADO) {
            throw new IllegalStateException("Apenas mensagens falhadas podem ser reprocessadas.");
        }
        status = MessageStatus.PENDENTE;
        attempts = 0;
        lastError = null;
        nextAttemptAt = LocalDateTime.now();
        updatedAt = nextAttemptAt;
    }

    private static String sanitizeError(String error) {
        if (error == null || error.isBlank()) return "Falha no processamento";
        String singleLine = error.replaceAll("[\\r\\n]+", " ");
        return singleLine.substring(0, Math.min(singleLine.length(), 500));
    }
}
