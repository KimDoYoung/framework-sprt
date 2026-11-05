package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * A-View 미리보기 (AS-IS JsonFileView_AView.fileView 응답 aViewPath·tmpFilePath·onm 을 합친 주소)
 *
 * @param viewUrl {homeUrl}/view?url={임시 파일 주소}&onm={원래 파일명}
 */
public record AViewRes(String viewUrl) {
}
