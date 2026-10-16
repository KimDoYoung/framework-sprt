package kr.co.kfs.asseterp.biz.sys.dto;

/**
 * A09 매뉴 편집·이동 저장 (AS-IS sys.Sys06_Menu.update — UpdateDataModel(sys06_menu)의 모델 컬럼 11개).
 * menuId는 서버가 채운다(등록 = 채번, 수정 = 경로). Y/N은 'true'/'false'
 */
public record MenuSaveReq(Long menuId, String menuNm, String seq, String note, Long parentId, String useYn, String classNm,
                          String menualUrl, String addTitleUseYn, String mobiUseYn, String mobiClassNm, String menuNo) {

    public MenuSaveReq withMenuId(Long id) {
        return new MenuSaveReq(id, menuNm, seq, note, parentId, useYn, classNm, menualUrl, addTitleUseYn, mobiUseYn, mobiClassNm,
                menuNo);
    }
}
