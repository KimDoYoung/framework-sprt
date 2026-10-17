package kr.co.kfs.asseterp.biz.ics.dto;

import java.util.List;

/** 서식파일 불러오기 (Ics01_Lookup_IcsFile.listLookup → sys.Sys11_RelateFile.insert): 고른 파일 id 목록 */
public record IcsRelateFileAddReq(List<Long> fileIds) {
}
