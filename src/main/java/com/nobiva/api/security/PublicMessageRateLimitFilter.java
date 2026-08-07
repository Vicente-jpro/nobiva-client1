package com.nobiva.api.security;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class PublicMessageRateLimitFilter extends OncePerRequestFilter {
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    @Value("${app.client-messages.rate-limit-per-minute:5}")
    private int limit;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        boolean publicCreation = "POST".equals(request.getMethod()) && "/client-messages".equals(path);
        return !publicCreation;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        long minute = Instant.now().getEpochSecond() / 60;
        String key = request.getRemoteAddr();
        Window window = windows.compute(key, (ignored, current) ->
                current == null || current.minute != minute ? new Window(minute) : current);
        if (window.counter.incrementAndGet() > limit) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Limite de pedidos excedido. Tente novamente mais tarde.\"}");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private static final class Window {
        private final long minute;
        private final AtomicInteger counter = new AtomicInteger();
        private Window(long minute) { this.minute = minute; }
    }
}
