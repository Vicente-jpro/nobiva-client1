package com.nobiva.api.service;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.IContext;

import jakarta.mail.Message.RecipientType;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

class EmailServiceTest {
    @Test
    void usesApplicationAsSenderAndSuperAdministratorAsRecipient() throws Exception {
        JavaMailSender sender = mock(JavaMailSender.class);
        TemplateEngine templates = mock(TemplateEngine.class);
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        EmailService service = new EmailService(sender, templates);
        ReflectionTestUtils.setField(service, "emailServer", "no-reply@nobiva.ao");
        UUID id = UUID.randomUUID();
        LocalDateTime createdAt = LocalDateTime.of(2026, 8, 6, 10, 0);

        when(sender.createMimeMessage()).thenReturn(mimeMessage);
        when(templates.process(eq("client_message"), any(IContext.class)))
                .thenReturn("<p>Mensagem renderizada</p>");

        service.sendClientMessage(List.of("superadmin@nobiva.ao"), id, "cliente@example.com",
                "Pedido", "Preciso de ajuda", createdAt);

        assertArrayEquals(InternetAddress.parse("no-reply@nobiva.ao"), mimeMessage.getFrom());
        assertArrayEquals(InternetAddress.parse("superadmin@nobiva.ao"),
                mimeMessage.getRecipients(RecipientType.TO));
        assertEquals("Nova mensagem de cliente: Pedido", mimeMessage.getSubject());
        verify(templates).process(eq("client_message"), any(IContext.class));
        verify(sender).send(mimeMessage);
    }
}
