package com.asseterp.oms.common.config;

import com.asseterp.oms.common.config.properties.RedisProbeProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisPassword;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.util.StringUtils;

import java.net.InetSocketAddress;
import java.net.Socket;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class RedisConfig {

    private final RedisProbeProperties probeProperties;

    @Value("${spring.data.redis.host:localhost}")
    private String host;

    @Value("${spring.data.redis.port:6379}")
    private int port;

    @Value("${spring.data.redis.password:}")
    private String password;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        String targetHost = determineHost();
        log.info("Redis 연결 대상 호스트 확정: {}:{}", targetHost, port);

        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration(targetHost, port);
        if (StringUtils.hasText(password)) {
            redisConfig.setPassword(RedisPassword.of(password));
        }
        return new LettuceConnectionFactory(redisConfig);
    }

    private String determineHost() {
        // 1. 설정된 host(localhost 등) 먼저 테스트
        if (canConnect(host, port)) {
            return host;
        }
        // 2. asseterp.redis.fallback-hosts 순서대로 테스트 (도커 별칭, 브릿지 게이트웨이 등)
        for (String fallbackHost : probeProperties.fallbackHosts()) {
            if (canConnect(fallbackHost, port)) {
                return fallbackHost;
            }
        }
        return host;
    }

    private boolean canConnect(String h, int p) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(h, p), (int) probeProperties.connectTimeout().toMillis());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        return new StringRedisTemplate(redisConnectionFactory);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setStringSerializer(new StringRedisSerializer());
        return template;
    }
}
