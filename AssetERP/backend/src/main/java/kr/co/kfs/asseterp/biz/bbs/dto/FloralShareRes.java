package kr.co.kfs.asseterp.biz.bbs.dto;

/** AS-IS Bbs21_FloralRequestShareModel */
public record FloralShareRes(Long floralRequestShareId, Long floralRequestId, String shareCode, String shareName,
                             Long personId, String personName, Long orgId, String orgName) {
}
