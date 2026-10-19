package kr.co.kfs.asseterp.biz.fbx.dto;

import java.time.LocalDateTime;

/** 보관함 파일 한 행(Fbx01_TabPage_DocList). fileId = fbx03_file_id = 첨부(sys10_file)의 parent id */
public record FbxFileRes(Long fileId, Long boxId, Long dcrClassId, String dcrClassName, Long empId, String empName,
                         LocalDateTime crtDate, String fileName) {
}
