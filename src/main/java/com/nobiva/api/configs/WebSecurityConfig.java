package com.nobiva.api.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

import com.nobiva.api.security.AuthEntryPointJwt;
import com.nobiva.api.security.AuthTokenFilter;
import com.nobiva.api.security.PublicMessageRateLimitFilter;
import com.nobiva.api.service.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    private PublicMessageRateLimitFilter publicMessageRateLimitFilter;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public FilterRegistrationBean<PublicMessageRateLimitFilter> disableRateLimitFilterAutoRegistration(
            PublicMessageRateLimitFilter filter) {
        FilterRegistrationBean<PublicMessageRateLimitFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configure(http))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth ->
            auth
            .requestMatchers(HttpMethod.POST, "/client-messages")
            .permitAll()

            .requestMatchers(HttpMethod.POST, "/houses/filter")
            .permitAll()

            .requestMatchers(HttpMethod.GET, "/auth/profile")
            .authenticated()

            .requestMatchers(HttpMethod.PATCH, "/auth/profile")
            .authenticated()

            .requestMatchers(HttpMethod.POST,
                    "/houses/**",
                    "/addresses/**",
                    "/plans/**",
                    "/subscriptions/**"
                    )
            .authenticated()

            .requestMatchers(HttpMethod.DELETE,
                    "/houses/**",
                    "/addresses/**",
                    "/plans/**",
                    "/subscriptions/**")
            .authenticated()


            .requestMatchers(HttpMethod.PATCH,
                    "/houses/**",
                    "/addresses/**",
                    "/plans/**",
                    "/subscriptions/**")
            .authenticated()


            .requestMatchers(
                    "/favorite-houses/**",
                    "/subscriptions/**")
                .authenticated()
            .requestMatchers(
                    "/houses/**",
                    "/addresses/**",
                    "/auth/**",
                    "/test/**",
                    "/localities/**",
                    "/provincias/**",
                    "/paises/**",
                    "/plans/**",
                    "/image/**",
                    "/email-tasks/**"
                    ).permitAll()

            //http://localhost:8080/api/swagger-ui/index.html
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html", "/webjars/**", "/actuator/**")
               .permitAll()
            .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(publicMessageRateLimitFilter, AuthTokenFilter.class);

        return http.build();
    }
}


