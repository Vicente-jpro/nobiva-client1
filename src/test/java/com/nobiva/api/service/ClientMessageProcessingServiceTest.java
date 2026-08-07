package com.nobiva.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.nobiva.api.domain.entities.messages.ClientMessage;
import com.nobiva.api.domain.entities.messages.MessageStatus;
import com.nobiva.api.domain.entities.user.RoleType;
import com.nobiva.api.domain.entities.user.User;
import com.nobiva.api.dto.ClientMessageEvent;
import com.nobiva.api.repositories.ClientMessageRepository;
import com.nobiva.api.repositories.UserRepository;

class ClientMessageProcessingServiceTest {
    @Test
    void emailsOnlyActiveSuperAdministratorsAndMarksMessageProcessed() throws Exception {
        ClientMessageRepository messages = mock(ClientMessageRepository.class);
        UserRepository users = mock(UserRepository.class);
        EmailService email = mock(EmailService.class);
        ClientMessageProcessingService service = new ClientMessageProcessingService(messages, users, email);
        ClientMessage message = ClientMessage.create("cliente@example.com", "Ajuda", "Preciso de ajuda");
        message.markPublished();
        ClientMessageEvent event = new ClientMessageEvent(message.getId(), message.getEmail(),
                message.getSubject(), message.getDescription());
        User superAdmin = mock(User.class);

        when(messages.findByIdForUpdate(message.getId())).thenReturn(Optional.of(message));
        when(superAdmin.getEmail()).thenReturn("superadmin@nobiva.ao");
        when(users.findEnabledUsersByRoles(Set.of(RoleType.SUPER_ADMINSTRADOR)))
                .thenReturn(List.of(superAdmin));

        assertTrue(service.process(event));

        verify(users).findEnabledUsersByRoles(Set.of(RoleType.SUPER_ADMINSTRADOR));
        verify(email).sendClientMessage(eq(List.of("superadmin@nobiva.ao")), eq(message.getId()),
                eq("cliente@example.com"), eq("Ajuda"), eq("Preciso de ajuda"),
                eq(message.getCreatedAt()));
        assertEquals(MessageStatus.PROCESSADO, message.getStatus());
    }
}
