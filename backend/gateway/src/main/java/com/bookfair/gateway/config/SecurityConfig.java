package com.bookfair.gateway.config;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

  @Value("${security.oauth2.resourceserver.jwt.secret}")
  private String jwtSecret;


  @Bean
  public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
    return http
        .csrf(ServerHttpSecurity.CsrfSpec::disable)
        .authorizeExchange(exchanges -> exchanges
            // ----- PUBLIC -----
            .pathMatchers(HttpMethod.POST, "/auth/signup", "/auth/login").permitAll()
            .pathMatchers("/actuator/**").permitAll()
            .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            // swagger if you expose it from gateway
            .pathMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

            // ----- ADMIN-ONLY (coarse gateway checks) -----
            // Example: protect all admin management in stall-service
            .pathMatchers(HttpMethod.POST, "/api/stalls/**").hasRole("ADMIN")
            .pathMatchers(HttpMethod.PUT, "/api/stalls/**").hasRole("ADMIN")
            .pathMatchers(HttpMethod.DELETE, "/api/stalls/**").hasRole("ADMIN")
            // Notification templates mgmt (if any)
            .pathMatchers("/api/notification/admin/**").hasRole("ADMIN")

            // ----- AUTHENTICATED (any role) -----
            .pathMatchers("/api/reservations/**").authenticated()
            .pathMatchers("/api/notification/**").authenticated()
            .pathMatchers("/api/stalls/**").authenticated()
            .pathMatchers("/api/me/**").authenticated()
            .pathMatchers("/api/users/**").authenticated()
            .pathMatchers("/api/stall-users/**").authenticated()

            // anything else requires auth
            .anyExchange().authenticated()
        )
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt
                .jwtDecoder(jwtDecoder())
                .jwtAuthenticationConverter(jwtAuthenticationConverter())
            )
        )
        .build();
  }

  @Bean
  public ReactiveJwtDecoder jwtDecoder() {
    var keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
    var key = new SecretKeySpec(keyBytes, "HmacSHA256");
    return NimbusReactiveJwtDecoder.withSecretKey(key).build();
  }

  @Bean
  public Converter<Jwt, Mono<AbstractAuthenticationToken>> jwtAuthenticationConverter() {
    return jwt -> {
      try {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        // 1) role (string) e.g. "ADMIN" or "ROLE_ADMIN"
        String role = jwt.getClaimAsString("role");
        if (role != null && !role.isBlank()) {
          String normalized = role.startsWith("ROLE_") ? role : "ROLE_" + role;
          authorities.add(new SimpleGrantedAuthority(normalized));
        }

        // 2) roles (array) e.g. ["ADMIN","VENDOR"]
        List<String> roles = jwt.getClaimAsStringList("roles");
        if (roles != null) {
          for (String r : roles) {
            if (r != null && !r.isBlank()) {
              String normalized = r.startsWith("ROLE_") ? r : "ROLE_" + r;
              authorities.add(new SimpleGrantedAuthority(normalized));
            }
          }
        }

        // 3) scopes (optional)
        List<String> scopes = Optional.ofNullable(jwt.getClaimAsStringList("scope"))
            .orElseGet(() -> jwt.getClaimAsStringList("scp"));
        if (scopes != null) {
          authorities.addAll(scopes.stream()
              .filter(Objects::nonNull)
              .map(s -> new SimpleGrantedAuthority("SCOPE_" + s))
              .toList());
        }

        return Mono.just(new JwtAuthenticationToken(jwt, authorities));
      } catch (Exception e) {
        // invalid → unauthenticated
        return Mono.empty();
      }
    };
  }
}