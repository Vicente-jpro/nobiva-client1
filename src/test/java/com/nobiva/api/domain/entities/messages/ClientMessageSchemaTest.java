package com.nobiva.api.domain.entities.messages;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

class ClientMessageSchemaTest {
    private static final Set<String> EXPECTED_FIELDS = Set.of(
            "id", "email", "subject", "description", "status", "attempts", "lastError",
            "nextAttemptAt", "createdAt", "updatedAt", "publishedAt", "processedAt", "version");

    @Test
    void entityContainsOnlyUnidirectionalMessageState() {
        Set<String> fields = Arrays.stream(ClientMessage.class.getDeclaredFields())
                .map(field -> field.getName())
                .collect(Collectors.toSet());

        assertEquals(EXPECTED_FIELDS, fields);
    }

    @Test
    void initialSchemaContainsNoConversationModel() throws IOException {
        String table = resource("/db/changelog/initial/client-messages-table.sql").toLowerCase();
        String master = resource("/db/changelog/db.changelog-master.xml").toLowerCase();

        for (String forbidden : Set.of("owner_user_id", "conversation_status", "guest_token",
                "last_interaction_at", "client_last_read_at", "staff_last_read_at", "closed_at",
                "closed_by_user_id", "client_conversation_messages")) {
            assertFalse(table.contains(forbidden), forbidden + " não deve existir no esquema inicial");
            assertFalse(master.contains(forbidden), forbidden + " não deve existir no master");
        }
        assertFalse(master.contains("conversation"));
    }

    private String resource(String path) throws IOException {
        try (var stream = getClass().getResourceAsStream(path)) {
            if (stream == null) throw new IOException("Recurso não encontrado: " + path);
            return new String(stream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
