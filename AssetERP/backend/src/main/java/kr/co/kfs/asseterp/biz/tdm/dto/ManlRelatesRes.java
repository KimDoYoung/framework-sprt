package kr.co.kfs.asseterp.biz.tdm.dto;

import java.util.List;

/** 점검항목에 연결된 법규·내규·양식·문서분류 (AS-IS Tdm43_Page_Relate의 그리드 4개) */
public record ManlRelatesRes(List<Ics> ics, List<Icr> icr, List<Form> forms, List<Dcr> dcrs) {

    /** AS-IS tdm45_manl_relate_ics.selectByManlId */
    public record Ics(Long manlRelateIcsId, Long icsClassTreeId, String icsClassTreeCode, String icsClassTreeName) {
    }

    /** AS-IS tdm46_manl_relate_icr.selectByManlId */
    public record Icr(Long manlRelateIcrId, Long icrClassTreeId, String icrClassTreeCode, String icrClassTreeName) {
    }

    /** AS-IS sys11_relate_file.selectByParentId */
    public record Form(Long relateFileId, Long fileId, String fileName, String regDate) {
    }

    /** AS-IS tdm47_manl_relate_dcr.selectByManlId */
    public record Dcr(Long manlRelateDcrId, Long dcrClassTreeId, String dcrClassTreeCode, String dcrClassTreeName, String dcrClassTreeFullName) {
    }
}
