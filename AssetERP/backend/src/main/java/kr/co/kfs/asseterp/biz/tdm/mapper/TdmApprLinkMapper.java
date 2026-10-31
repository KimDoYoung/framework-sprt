package kr.co.kfs.asseterp.biz.tdm.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkChckJobHtmlRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkChckJobRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleAllcDetailRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleDescRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleDescTaskRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkRoleDigmRow;
import kr.co.kfs.asseterp.biz.tdm.dto.TdmLinkTaskDetailRow;

/** 책무 결재 상신(A90·A91·A92·A94, V34) — 결재창 제목·본문 재료와 상신 뒤 문서 ID 기록·첨부 연결 */
@Mapper
public interface TdmApprLinkMapper {

    /** A90: 책무배분 상세(tdm34)의 직책·책무배분일 + 임원·직책 이름 (AS-IS tdm30_role_allc.selectById 이름 열) — 로그인 회사 행만 */
    TdmLinkRoleAllcDetailRow selectRoleAllcDetail(@Param("roleAllcDetailId") Long roleAllcDetailId, @Param("companyId") Long companyId);

    /** A90: AS-IS tdm12_task_relate_detail.getHtmlData */
    List<TdmLinkTaskDetailRow> selectTaskDetails(@Param("companyId") Long companyId, @Param("roleId") Long roleId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS tdm34_role_allc_detail.updateApprId (tdm34에는 회사 열이 없어 tdm30의 회사로 막는다) */
    int updateRoleAllcDetailApprId(@Param("roleAllcDetailId") Long roleAllcDetailId, @Param("companyId") Long companyId, @Param("apprId") Long apprId);

    /** A91: 책무기술서 한 건의 임원·직책 이름과 책무배분기준일 (tdm31_role_desc.selectByRegDate 와 같은 조인) — 로그인 회사 행만 */
    TdmLinkRoleDescRow selectRoleDesc(@Param("roleDescId") Long roleDescId, @Param("companyId") Long companyId);

    /** A91: AS-IS tdm30_role_allc.selectByPersonId */
    List<TdmLinkRoleDescTaskRow> selectRoleAllcByPersonId(@Param("companyId") Long companyId, @Param("personId") Long personId,
                                                          @Param("roleStartDate") LocalDate roleStartDate);

    /** AS-IS tdm31_role_desc.updateApprId (회사 조건 추가) */
    int updateRoleDescApprId(@Param("roleDescId") Long roleDescId, @Param("companyId") Long companyId, @Param("apprId") Long apprId);

    /** AS-IS tdm31_role_desc.updateWorkDate1(on) / updateWorkDate2(off) (회사 조건 추가) */
    int updateRoleDescWorkDate(@Param("roleDescId") Long roleDescId, @Param("companyId") Long companyId, @Param("on") boolean on);

    /** A92: 책무체계도의 책무배분기준일 — 로그인 회사 행만 */
    LocalDate selectRoleDigmAllcStdDate(@Param("roleDigmId") Long roleDigmId, @Param("companyId") Long companyId);

    /** A92: AS-IS tdm30_role_allc.selectByAllcStdDate */
    List<TdmLinkRoleDigmRow> selectRoleAllcByAllcStdDate(@Param("companyId") Long companyId, @Param("allcStdDate") LocalDate allcStdDate);

    /** 책무체계도 목록 그리드의 roleDigmFileId(사용자 올린 파일 정보가 있으면 그것, 없으면 시스템 생성 파일 정보) — tdm32_role_digm.selectByRegDate 와 같은 식 */
    Long selectRoleDigmFileId(@Param("roleDigmId") Long roleDigmId);

    /** AS-IS tdm32_role_digm.updateApprId (회사 조건 추가) */
    int updateRoleDigmApprId(@Param("roleDigmId") Long roleDigmId, @Param("companyId") Long companyId, @Param("apprId") Long apprId);

    /** AS-IS tdm32_role_digm.updateUseFileType (회사 조건 추가) — 최종사용파일구분 1:시스템 생성 2:사용자 업로드 */
    int updateRoleDigmUseFileType(@Param("roleDigmId") Long roleDigmId, @Param("companyId") Long companyId, @Param("useFileType") String useFileType);

    /** A94: 이행점검 작업의 점검년월·점검시작일 — 로그인 회사 행만 */
    TdmLinkChckJobRow selectChckJob(@Param("chckJobId") Long chckJobId, @Param("companyId") Long companyId);

    /** A94: 보고CEO 직책 이름 (Tdm50_Tab_CheckJob의 cleanRoleName — 목록의 `이름 : 건수` 에서 이름만) */
    String selectRoleName(@Param("roleId") Long roleId, @Param("companyId") Long companyId);

    /** A94: AS-IS tdm51_chck_org.selectApprContent */
    List<TdmLinkChckJobHtmlRow> selectApprContent(@Param("companyId") Long companyId, @Param("ceoRoleId") Long ceoRoleId, @Param("checkYm") String checkYm);

    /** AS-IS tdm56_chck_relate_appr.insertApprId */
    int insertChckRelateAppr(@Param("relateTableId") Long relateTableId, @Param("apprId") Long apprId, @Param("ceoRoleId") Long ceoRoleId);

    /** AS-IS sys10_file.selectByParentId의 파일 ID (Sys10_File.copyFile이 돌린다 — 첨부 자동등록 copyFileLine) */
    List<Long> selectFileIds(@Param("parentId") Long parentId);

    int countApprRelateFile(@Param("fileId") Long fileId, @Param("apprId") Long apprId);

    /** AS-IS sys11_relate_file.insert */
    int insertApprRelateFile(@Param("relateFileId") long relateFileId, @Param("fileId") Long fileId, @Param("apprId") Long apprId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();
}
