package kr.co.kfs.asseterp.biz.dcr.dto;

import java.time.LocalDateTime;

/** 문서별 첨부파일 검색 한 줄 (AS-IS Dcr00_Tab_FileList 그리드). fileId는 AS-IS Dcr00_DocListModel.docId(= sys10_file_id), apprId는 보기 아이콘이 열 상신문서 */
public record DcrDocFileRes(Long fileId, Long apprId, String classTreeName, LocalDateTime regDate, String inoutName, String aprTitle, String fileName,
                            String note, String empName) {
}
