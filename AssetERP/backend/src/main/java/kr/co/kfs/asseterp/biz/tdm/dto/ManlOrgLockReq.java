package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 잠금 처리 (AS-IS tdm.Tdm42_ManlOrg.updateLock 의 actionType 'P' 잠금 / 'C' 잠금해제 + 대상 목록) */
public record ManlOrgLockReq(String actionType, List<Long> manlOrgIds) {
}
