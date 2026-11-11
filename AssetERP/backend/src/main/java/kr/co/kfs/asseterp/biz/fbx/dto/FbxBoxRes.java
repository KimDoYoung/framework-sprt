package kr.co.kfs.asseterp.biz.fbx.dto;

import java.time.LocalDateTime;

/** 파일보관함 한 행(Fbx01_Tab_Document·Fbx01_Tab_Search 위 그리드). 문서분류·종료 열은 이 화면이 쓰지 않는다. act*: 마지막 변경(원본 2026-11-04) */
public record FbxBoxRes(Long boxId, LocalDateTime crtDate, Long crtEmpId, String title, String note, String statusCd,
                        String statusName, Long fileCount, LocalDateTime actDate, String actEmpName, String actOrgName) {
}
