package com.bookfair.user_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.function.Function;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Data
public class JwtService {

  @Value("${security.jwt.secret}")
  private String secret;

  @Value("${security.jwt.exp-minutes:60}")
  private long expMinutes;

  private Key key() {
    return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  // ✅ Generate token
  public String generate(UserDetails ud, Long userId, String role) {
    Instant now = Instant.now();
    return Jwts.builder()
        .setSubject(ud.getUsername())
        .claim("uid", userId)
        .claim("role", role)
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(now.plus(Duration.ofMinutes(expMinutes))))
        .signWith(key(), SignatureAlgorithm.HS256)
        .compact();
  }

  // ✅ Parse and return claims safely
  public Claims extractAllClaims(String token) throws JwtException {
    return Jwts.parserBuilder()
        .setSigningKey(key())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  // ✅ Generic claim extractor
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  // ✅ Username from token
  public String getUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  // ✅ Check expiration
  public boolean isTokenExpired(String token) {
    try {
      return extractClaim(token, Claims::getExpiration).before(new Date());
    } catch (ExpiredJwtException e) {
      return true;
    }
  }

  // ✅ Validation helper
  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = getUsername(token);
    return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }
}
