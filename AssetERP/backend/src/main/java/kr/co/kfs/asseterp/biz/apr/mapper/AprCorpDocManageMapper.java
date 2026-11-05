package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRowRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocRowSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprCorpDocTotalRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** 법인서류 매수관리·신청 화면 (AS-IS server/apr/Apr17_CorpDoc · Apr19_RelateStamp) — U2-02 Apr17_Tab_CorpDoc · Apr17_Tab_CorpDocApp */
@Mapper
public interface AprCorpDocManageMapper {

    /** AS-IS apr17_corp_doc.selectByCorpRegDate */
    List<AprCorpDocRowRes> selectRegistered(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** AS-IS apr17_corp_doc.selectByRegDate */
    List<AprCorpDocTotalRes> selectTotals(@Param("companyId") Long companyId);

    /** AS-IS apr17_corp_doc.selectByAppDate */
    List<AprCorpDocRowRes> selectApplications(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("searchText") String searchText,
                                              @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate, @Param("procResult") boolean procResult);

    /** AS-IS apr17_corp_doc.selectById — 로그인 회사의 한 건 */
    AprCorpDocRowRes selectRowById(@Param("companyId") Long companyId, @Param("corpDocId") Long corpDocId);

    long selectNextId();

    /** 법인서류 매수관리(Apr17_Tab_CorpDoc)의 저장 — UpdateDataModel 수정/등록 */
    int updateRegistered(@Param("companyId") Long companyId, @Param("req") AprCorpDocRowSaveReq req);

    int insertRegistered(@Param("companyId") Long companyId, @Param("req") AprCorpDocRowSaveReq req);

    /** 신청 화면(Apr17_Tab_CorpDocApp)의 저장 */
    int updateApplication(@Param("companyId") Long companyId, @Param("req") AprCorpDocRowSaveReq req);

    int insertApplication(@Param("companyId") Long companyId, @Param("callEmpId") Long callEmpId, @Param("req") AprCorpDocRowSaveReq req);

    /** AS-IS apr17_corp_doc.regDelete — 신청일이 없는 줄(직접 등록한 줄)은 지운다 */
    int deleteRegistered(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS apr17_corp_doc.regDateUpdate(regDate = null) — 신청에서 온 줄은 등록일만 비운다 */
    int clearRegDate(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS Apr17_CorpDoc.delete(UpdateDataModel.deleteModel) */
    int deleteApplications(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS apr19_relate_stamp.selectByCorpDocId — 로그인 회사의 법인서류 것만 */
    List<AprRelateStampRes> selectStamps(@Param("companyId") Long companyId, @Param("corpDocId") Long corpDocId);

    AprRelateStampRes selectStampById(@Param("companyId") Long companyId, @Param("relateStampId") Long relateStampId);

    int updateStamp(@Param("companyId") Long companyId, @Param("req") AprRelateStampSaveReq req);

    int insertStamp(@Param("companyId") Long companyId, @Param("req") AprRelateStampSaveReq req);

    int deleteStamps(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** AS-IS sys99_print.deleteByPersonId — 내 출력 자료 지우기 */
    int deletePrint(@Param("companyId") Long companyId, @Param("personId") Long personId, @Param("windowClassName") String windowClassName);

    /** AS-IS sys99_print.insert — Sys99_Print.insertRdCorpDoc가 채우는 열만 (등록일·매수 6개·제공처·목적·요청자·비고) */
    int insertPrint(@Param("printId") long printId, @Param("companyId") Long companyId, @Param("personId") Long personId,
                    @Param("windowClassName") String windowClassName, @Param("groupId") long groupId, @Param("row") AprCorpDocRowRes row);
}
