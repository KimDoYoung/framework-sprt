package kr.co.kfs.asseterp.oms.biz.push.dto;

import java.util.List;

/** 강제 로그아웃 대상 (세션 사용자 ID). 비어 있으면 아무도 끊지 않는다 — 전체는 /force-logout-all */
public record ForceLogoutReq(List<Long> userIds) {
}
