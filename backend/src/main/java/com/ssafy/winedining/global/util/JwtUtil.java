package com.ssafy.winedining.global.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ssafy.winedining.global.auth.dto.TokenDTO;
import com.ssafy.winedining.global.exception.BaseException;
import com.ssafy.winedining.global.exception.ErrorCode;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration}") long accessTokenExpiration,
            @Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration
    ) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public TokenDTO generateTokens(String email) {
        String accessToken = generateToken(email, accessTokenExpiration);
        String refreshToken = generateToken(email, refreshTokenExpiration);
        return new TokenDTO(accessToken, refreshToken, accessTokenExpiration);
    }

    private String generateToken(String email, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)  // JJWT 0.12.x에서는 expiration()
                .signWith(key)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (SecurityException | MalformedJwtException |
                 UnsupportedJwtException | IllegalArgumentException e) {
            throw new BaseException(ErrorCode.INVALID_TOKEN);
        } catch (ExpiredJwtException e) {
            throw new BaseException(ErrorCode.EXPIRED_TOKEN);
        }
    }

}