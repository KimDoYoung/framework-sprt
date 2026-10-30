package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotBlank;

/** AS-IS ast.Ast01_ClassTree.insertIpo — IPO 종목정보 생성(Ast06_Lookup_CreateIpoAstClass) */
public record IpoClassCreateReq(@NotBlank String classTreeName) {
}
