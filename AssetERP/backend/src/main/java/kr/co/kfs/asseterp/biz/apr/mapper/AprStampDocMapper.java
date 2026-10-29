package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprStampCheckRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocApplRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocLookupRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocSaveReq;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampDocSumRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprStampListRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/apr/mapper/apr16_stamp_doc.xml (T23 Apr16_Tab_StampDocManager) */
@Mapper
public interface AprStampDocMapper {
    /** selectDocByRegDate — applType null이면 1·2 모두, stampReprCorpId는 applType에 따라 인감ID/대표명의ID */
    List<AprStampDocRes> selectDocByRegDate(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                            @Param("applType") String applType, @Param("stampReprCorpId") Long stampReprCorpId);

    List<AprStampDocSumRes> selectDocGroupSum(@Param("companyId") Long companyId, @Param("applType") String applType, @Param("stampReprCorpId") Long stampReprCorpId);

    List<AprStampDocLookupRes> selectByApplType(@Param("companyId") Long companyId, @Param("applType") String applType);

    List<AprStampDocApplRes> selectApplDocByRegDateIsNull(@Param("companyId") Long companyId);

    /** 삭제·등록일 갱신 전 확인 — 신청일(applDate)이 있는지. 행이 없으면 null */
    LocalDate selectApplDate(@Param("companyId") Long companyId, @Param("stampDocId") Long stampDocId);

    int countById(@Param("companyId") Long companyId, @Param("stampDocId") Long stampDocId);

    long selectNextId();

    int insertStampDoc(@Param("companyId") Long companyId, @Param("stampDocId") Long stampDocId, @Param("r") AprStampDocSaveReq req);

    int updateStampDoc(@Param("companyId") Long companyId, @Param("r") AprStampDocSaveReq req);

    int deleteById(@Param("companyId") Long companyId, @Param("stampDocId") Long stampDocId);

    /** updateRegDate — regDate가 null이면 등록일을 비운다(신청내역으로 되돌림) */
    int updateRegDate(@Param("companyId") Long companyId, @Param("stampDocId") Long stampDocId, @Param("regDate") LocalDate regDate);

    long selectNextPrintId();

    int deletePrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId, @Param("windowClassName") String windowClassName);

    /** Sys99_Print.insertRdStampDocManager — selectDocByRegDate(1·2 전체) 목록을 sys99_print에 넣는다 */
    int insertPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId, @Param("windowClassName") String windowClassName,
                    @Param("groupId") long groupId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate);

    /** T24·T25 selectStampByCompanyId — orgId가 null이 아니면 그 부서가 쓸 수 있는 인감만(T25) */
    List<AprStampListRes> selectStampList(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                          @Param("stampId") Long stampId, @Param("outYn") boolean outYn, @Param("searchText") String searchText,
                                          @Param("orgId") Long orgId);

    /** Sys99_Print.insertRdStampListApr16 — selectStampList와 같은 조건의 목록을 sys99_print에 넣는다 */
    int insertStampListPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId, @Param("windowClassName") String windowClassName,
                             @Param("groupId") long groupId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                             @Param("stampId") Long stampId, @Param("outYn") boolean outYn, @Param("searchText") String searchText,
                             @Param("orgId") Long orgId);

    LocalDate selectStampDate(@Param("companyId") Long companyId, @Param("stampDocId") Long stampDocId);

    int updateStampDate(@Param("companyId") Long companyId, @Param("stampDocId") Long stampDocId, @Param("stampDate") LocalDate stampDate);

    /** T26 selectStampCheck */
    List<AprStampCheckRes> selectStampCheck(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                            @Param("stampId") Long stampId, @Param("notStampFileYn") boolean notStampFileYn);

    /** T26 updateConfirmDate — 확인취소는 confirmerId·confirmDate가 null */
    int updateConfirm(@Param("companyId") Long companyId, @Param("stampDocId") Long stampDocId,
                      @Param("confirmerId") Long confirmerId, @Param("confirmDate") LocalDate confirmDate);
}
