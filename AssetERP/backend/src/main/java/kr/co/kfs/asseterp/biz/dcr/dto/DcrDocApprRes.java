package kr.co.kfs.asseterp.biz.dcr.dto;

import java.time.LocalDateTime;

/**
 * 문서 다운로드 한 줄 (AS-IS Dcr00_Tab_ApprList 그리드, Dcr00_DocListModel). apprId는 보기 아이콘·다운로드 대상,
 * inoutCode·titleCount는 PDF 만들기 대상(사내문서 '20'이고 본문 파일이 없는 문서) 판정용
 */
public record DcrDocApprRes(Long apprId, String classTreeName, LocalDateTime regDate, String inoutName, String inoutCode, String aprTitle,
                            String empName, Long fileCount, Long titleCount) {
}
