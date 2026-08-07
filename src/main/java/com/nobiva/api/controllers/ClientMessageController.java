package com.nobiva.api.controllers;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nobiva.api.dto.ClientMessageRequest;
import com.nobiva.api.dto.ClientMessageResponse;
import com.nobiva.api.service.ClientMessageService;

import jakarta.validation.Valid;
@Validated
@RestController
@RequestMapping("/client-messages")
public class ClientMessageController {
    private final ClientMessageService service;

    public ClientMessageController(ClientMessageService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ClientMessageResponse> create(@Valid @RequestBody ClientMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINSTRADOR','SUPER_ADMINSTRADOR')")
    public Page<ClientMessageResponse> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    @PostMapping("/{id}/retry")
    @PreAuthorize("hasAnyRole('ADMINSTRADOR','SUPER_ADMINSTRADOR')")
    public ClientMessageResponse retry(@PathVariable UUID id) {
        return service.retry(id);
    }
}
