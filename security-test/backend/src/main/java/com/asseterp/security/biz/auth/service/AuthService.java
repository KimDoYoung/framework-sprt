package com.asseterp.security.biz.auth.service;

import com.asseterp.security.biz.auth.dto.LoginReq;
import com.asseterp.security.biz.auth.dto.LoginRes;
import com.asseterp.security.biz.auth.dto.UserPrincipal;
import com.asseterp.security.biz.user.entity.AppUser;
import com.asseterp.security.biz.user.mapper.AppUserMapper;
import com.asseterp.security.common.jwt.JwtTokenProvider;
import com.asseterp.security.common.jwt.RedisTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AppUserMapper appUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RedisTokenService redisTokenService;

    @Transactional
    public LoginRes login(LoginReq req) {
        log.info("로그인 시도: username={}", req.username());

        AppUser user = appUserMapper.findByUsername(req.username())
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + req.username()));

        // 요구사항 6: 평문 패스워드 비교
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
        }

        // 고유 jti 생성 (요구사항 7, 8)
        String jti = UUID.randomUUID().toString();
        UserPrincipal principal = UserPrincipal.from(user, jti);

        String accessToken = tokenProvider.generateAccessToken(principal, jti);

        // Redis에 활성 jti 저장 (기존 브라우저 접속 즉시 차단)
        long ttlMillis = Math.max(tokenProvider.getRefreshTokenExpiration(), 60000);
        redisTokenService.saveActiveJti(user.getUserId(), jti, Duration.ofMillis(ttlMillis));

        log.info("로그인 성공: userId={}, username={}, jti={}", user.getUserId(), user.getUsername(), jti);

        return new LoginRes(
                principal.getUserId(),
                principal.getUsername(),
                principal.getName(),
                principal.getCompanyId(),
                principal.getDeptId(),
                principal.getRoles(),
                jti,
                accessToken,
                tokenProvider.getAccessTokenExpiration()
        );
    }

    public void logout(Long userId) {
        if (userId != null) {
            redisTokenService.removeActiveJti(userId);
            log.info("로그아웃 완료: userId={}", userId);
        }
    }
}
