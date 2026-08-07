package com.nobiva.api.service;

import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nobiva.api.domain.entities.messages.MessageStatus;
import com.nobiva.api.domain.entities.user.RoleType;
import com.nobiva.api.dto.ClientMessageEvent;
import com.nobiva.api.repositories.ClientMessageRepository;
import com.nobiva.api.repositories.UserRepository;

import jakarta.mail.MessagingException;
@Service
public class ClientMessageProcessingService {
    private final ClientMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ClientMessageProcessingService(ClientMessageRepository messageRepository,
                                          UserRepository userRepository,
                                          EmailService emailService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public boolean process(ClientMessageEvent event) throws MessagingException {
        var message = messageRepository.findByIdForUpdate(event.messageId())
                .orElseThrow(() -> new IllegalArgumentException("Mensagem não encontrada."));
        if (message.getStatus() == MessageStatus.PROCESSADO) return false;
        if (message.getStatus() != MessageStatus.PUBLICADO) {
            throw new IllegalStateException("Mensagem não está pronta para consumo.");
        }
        var recipients = userRepository.findEnabledUsersByRoles(
                        Set.of(RoleType.SUPER_ADMINSTRADOR)).stream()
                .map(user -> user.getEmail()).distinct().toList();
        emailService.sendClientMessage(recipients, message.getId(), event.email(), event.assunto(),
                event.descricao(), message.getCreatedAt());
        message.markProcessed();
        return true;
    }
}
