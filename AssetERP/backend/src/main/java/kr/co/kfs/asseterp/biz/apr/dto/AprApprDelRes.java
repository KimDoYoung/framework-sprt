package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** 폐기문서 한 행(Apr01_Tab_Restore 그리드, AS-IS Apr01_ApprModel 중 쓰는 속성) */
public record AprApprDelRes(Long apprId, LocalDateTime regDate, LocalDateTime effectDate, String classTreeNameAllPath, String title,
                            String aprOrgName, String aprPersonName, LocalDateTime delDate, String delEmpName) {
}
