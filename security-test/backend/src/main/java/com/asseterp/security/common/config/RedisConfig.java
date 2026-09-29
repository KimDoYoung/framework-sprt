package com.asseterp.security.common.config;

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
public class RedisConfig {

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
        // 2. 도커 컨테이너 네트워크 별칭 'redis' 테스트
        if (canConnect("redis", port)) {
            return "redis";
        }
        // 3. 도커 브릿지 게이트웨이 '172.18.0.1' 테스트
        if (canConnect("172.18.0.1", port)) {
            return "172.18.0.1";
        }
        return host;
    }

    private boolean canConnect(String h, int p) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(h, p), 400);
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
