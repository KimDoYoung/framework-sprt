package kr.co.kfs.asseterp.biz.dcr.dto;

import java.util.List;

/** AS-IS updateLink·updateForm: 목적지 회사 목록 + 로그인(관리자) 회사의 Link ID 목록 */
public record DcrLinkCopyReq(List<Long> companyIds, List<Long> linkIds) {
}
