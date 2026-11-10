package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * AI 서버(BotService) 설정 (asseterp.bot.*) — AS-IS utils.bot.BotService에 주소가 하드코딩(https://bot.k-fs.co.kr:51443/api/erp/completion).
 * 개발 서버는 tools/ext-simulator(AI·새 메일 시뮬레이터)를 가리킨다.
 *
 * @param url 완성 API 주소 (POST JSON {user_prompt, task_type} → {success, content, error})
 */
@ConfigurationProperties(prefix = "asseterp.bot")
public record BotProperties(String url) {
}
