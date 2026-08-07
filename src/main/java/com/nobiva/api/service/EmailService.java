package com.nobiva.api.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.nobiva.api.domain.EmailMessage;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class EmailService {

	@Value("${spring.mail.username}")
	private String emailServer;

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;


    @Autowired
    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Async("taskExecutor")
    public void sendEmail(EmailMessage email) throws MessagingException {

    	// Prepare the email context (variables to be used on html template)
        Context context = new Context();
        context.setVariables(email.getModel());

        // Render the HTML content using Thymeleaf template
        String htmlContent = templateEngine.process(email.getTemplateName(), context);

        // Create the email message
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // Set email details
        helper.setFrom(emailServer);
        helper.setTo(email.getTo());
        helper.setSubject(email.getSubject());
        helper.setText(htmlContent, true); // true for HTML content

        // Send the email
        mailSender.send(message);
    }

    public void sendClientMessage(Collection<String> recipients, UUID messageId, String senderEmail,
                                  String subject, String description, LocalDateTime createdAt)
            throws MessagingException {
        if (recipients == null || recipients.isEmpty()) {
            throw new MessagingException("Nenhum superadministrador ativo encontrado.");
        }
        Context context = new Context();
        context.setVariables(Map.of("senderEmail", senderEmail, "subject", subject,
                "description", description, "messageId", messageId, "createdAt", createdAt));
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(emailServer);
        helper.setTo(recipients.toArray(String[]::new));
        helper.setSubject("Nova mensagem de cliente: " + sanitizeHeader(subject));
        helper.setText(templateEngine.process("client_message", context), true);
        mailSender.send(message);
    }

    private String sanitizeHeader(String value) {
        return value.replaceAll("[\\r\\n\\p{Cntrl}]+", " ").trim();
    }


}
