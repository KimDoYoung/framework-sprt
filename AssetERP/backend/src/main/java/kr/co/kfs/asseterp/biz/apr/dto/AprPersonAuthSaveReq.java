package kr.co.kfs.asseterp.biz.apr.dto;

import java.util.List;

/** 공람설정 저장 — 새로 넣을 사원과 지울 줄 (AS-IS Apr13_PersonAuth.update·delete) */
public record AprPersonAuthSaveReq(List<Long> addPersonIds, List<Long> deleteIds) {
}
