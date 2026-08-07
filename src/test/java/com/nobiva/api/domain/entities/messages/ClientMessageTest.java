package com.nobiva.api.domain.entities.messages;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class ClientMessageTest {
    @Test
    void createsPendingAndTransitionsThroughTheSuccessfulFlow() {
        ClientMessage message = ClientMessage.create(" USER@Example.com ", " Assunto ", " Descrição ");

        assertEquals(MessageStatus.PENDENTE, message.getStatus());
        assertEquals("user@example.com", message.getEmail());
        assertEquals(0, message.getAttempts());

        message.markPublished();
        assertEquals(MessageStatus.PUBLICADO, message.getStatus());

        message.markProcessed();
        assertEquals(MessageStatus.PROCESSADO, message.getStatus());
    }

    @Test
    void publicationFailuresUseRetryAndEventuallyFail() {
        ClientMessage message = ClientMessage.create("user@example.com", "Assunto", "Descrição");

        message.registerFailure("temporário", 2, 120);
        assertEquals(MessageStatus.PENDENTE, message.getStatus());
        assertEquals(1, message.getAttempts());

        message.registerFailure("definitivo", 2, 120);
        assertEquals(MessageStatus.FALHADO, message.getStatus());
        assertEquals(2, message.getAttempts());

        message.resetForRetry();
        assertEquals(MessageStatus.PENDENTE, message.getStatus());
        assertEquals(0, message.getAttempts());
    }

    @Test
    void onlyFailedMessagesCanBeReset() {
        ClientMessage message = ClientMessage.create("user@example.com", "Assunto", "Descrição");
        assertThrows(IllegalStateException.class, message::resetForRetry);
    }
}
