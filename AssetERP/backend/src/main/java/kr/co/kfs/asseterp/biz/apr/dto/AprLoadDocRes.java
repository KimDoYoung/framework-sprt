package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDateTime;

/** Apr05_Grid_RelateAprList 한 행 (apr03_relate_fund.selectByClassTreeId·selectBySearch). content는 미리보기(apr01_content) */
public record AprLoadDocRes(Long apprId, String statusName, String title, String fundName, LocalDateTime regDate, LocalDateTime effectDate,
                            String regEmpName, String content) {
}
