package kr.co.kfs.asseterp.biz.fbx.dto;

import java.time.LocalDateTime;

/** 파일보관함 기록 한 행(Fbx02_Popup_History) */
public record FbxHistoryRes(Long historyId, LocalDateTime actDate, String actName, String actContent, String actEmpName,
                            String actOrgName) {
}
