package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 법인서류에 붙은 인감날인 한 줄 (AS-IS Apr19_RelateStampModel — apr19_relate_stamp.selectByCorpDocId, U2-02) */
public record AprRelateStampRes(Long relateStampId, Long corpDocId, Long stampId, String stampName, Long stampCnt,
                                Boolean outYn, LocalDate stampDate) {
}
