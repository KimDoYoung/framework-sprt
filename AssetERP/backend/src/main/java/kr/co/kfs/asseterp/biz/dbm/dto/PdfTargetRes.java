package kr.co.kfs.asseterp.biz.dbm.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

import java.time.LocalDateTime;

/** AS-IS Apr01_ApprModel — apr01_appr.selectPdfMakeTarget (PDF 생성 대상: 결재완료·대외문서·제목 파일 없음) */
public record PdfTargetRes(
        @JsonSerialize(using = ToStringSerializer.class) Long apprId,
        LocalDateTime regDate,
        LocalDateTime effectDate,
        String classTreeNameAllPath,
        String title,
        String regEmpName,
        String orgName) {
}
