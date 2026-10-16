package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** 전송·로그아웃 결과: 처리한(접속 중이던) 사원 수와 오프라인이라 건너뛴 사원 이름 */
public record WebsocketResultRes(int processed, List<String> offlineNames) {
}
