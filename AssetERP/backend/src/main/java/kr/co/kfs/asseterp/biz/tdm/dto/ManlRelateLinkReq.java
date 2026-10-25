package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 고른 점검항목들에 법규·내규·양식·문서분류를 연결 (AS-IS Tdm45·46·47_…insertList / Sys11_RelateFile.insertTdmManlList). kind: ics·icr·form·dcr, relateIds = 분류 ID 또는 파일 ID */
public record ManlRelateLinkReq(String kind, List<Long> manlIds, List<Long> relateIds) {
}
