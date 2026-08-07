package com.nobiva.api.exceptions;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.nobiva.api.util.ApiErrors;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrors resourceNotFoundExceptionHandle(ResourceNotFoundException ex) {
        return new ApiErrors(ex.getMessage());
    }

    @ExceptionHandler(SenhaInvalidaException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrors senhaInvalidaExceptionHandle(SenhaInvalidaException ex) {
        return new ApiErrors(ex.getMessage());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrors usernameNotFoundExceptionHandle(UsernameNotFoundException ex) {
        return new ApiErrors("Recurso não encontrado.");
    }

    @ExceptionHandler(UsuarioException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrors usuarioExceptionHandle(UsuarioException ex) {
        return new ApiErrors(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrors illegalArgumentExceptionHandle(IllegalArgumentException ex) {
        return new ApiErrors(ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiErrors badCredentialsExceptionHandle(BadCredentialsException ex) {
        return new ApiErrors("Email ou palavra-passe inválidos.");
    }

    @ExceptionHandler({CannotCreateTransactionException.class, DataAccessException.class})
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public ApiErrors databaseUnavailableHandle(RuntimeException ex) {
        log.error("Falha de acesso à base de dados", ex);
        return new ApiErrors("Serviço temporariamente indisponível. Tente novamente mais tarde.");
    }

    @ExceptionHandler(MessagingException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public ApiErrors messagingExceptionHandle(MessagingException ex) {
        log.error("Falha ao enviar email", ex);
        return new ApiErrors("Não foi possível enviar o email neste momento. Tente novamente mais tarde.");
    }

    @ExceptionHandler(FileStorageException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrors fileStorageExceptionHandle(FileStorageException ex) {
        log.warn("Falha no armazenamento de ficheiro", ex);
        return new ApiErrors("Não foi possível processar o ficheiro enviado.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrors validateFieldsHandle(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        return new ApiErrors(errors);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiErrors unexpectedExceptionHandle(Exception ex) {
        log.error("Erro interno não tratado", ex);
        return new ApiErrors("Ocorreu um erro interno. Tente novamente mais tarde.");
    }
}
