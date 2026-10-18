package kr.co.kfs.asseterp.biz.dcr.dto;

import java.util.List;

/** 운용사별 문서분류 반영 (Dcr01_Lookup_DcrCopyAdmin.update) */
public record DcrCopyReq(Long dcrClassTreeId, List<Long> companyIds) {
}
