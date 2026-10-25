package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 잠금·잠금해제 (AS-IS tdm.Tdm53_ChckExct.updateLockYn 의 isLock + 대상) */
public record CheckLockReq(Boolean isLock, List<Long> chckExctIds) {
}
