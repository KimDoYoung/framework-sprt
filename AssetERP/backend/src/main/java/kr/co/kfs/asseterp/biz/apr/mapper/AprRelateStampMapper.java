package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampCheckRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprRelateStampListRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/apr/mapper/apr19_relate_stamp.xml (U2-03 Apr19_Tab_StampList · Apr19_Tab_OrgStampList · Apr19_Tab_StampFileCheck) */
@Mapper
public interface AprRelateStampMapper {

    /** selectBySearchText */
    List<AprRelateStampListRes> selectBySearchText(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                                   @Param("closeDate") LocalDate closeDate, @Param("stampId") Long stampId,
                                                   @Param("outYn") boolean outYn, @Param("searchText") String searchText);

    /** selectByOrgCodeId */
    List<AprRelateStampListRes> selectByOrgCodeId(@Param("companyId") Long companyId, @Param("orgCodeId") Long orgCodeId,
                                                  @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                                  @Param("stampId") Long stampId, @Param("outYn") boolean outYn,
                                                  @Param("searchText") String searchText);

    /** selectByStampCheckList */
    List<AprRelateStampCheckRes> selectByStampCheckList(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                                        @Param("closeDate") LocalDate closeDate, @Param("stampId") Long stampId,
                                                        @Param("notStampFileYn") boolean notStampFileYn);

    /** selectById — [수정] 창은 날인일자만 쓴다 */
    LocalDate selectStampDate(@Param("companyId") Long companyId, @Param("relateStampId") Long relateStampId);

    int countById(@Param("companyId") Long companyId, @Param("relateStampId") Long relateStampId);

    int updateStampDate(@Param("companyId") Long companyId, @Param("relateStampId") Long relateStampId, @Param("stampDate") LocalDate stampDate);

    /** update — 확인취소는 confirmerId·confirmDate가 null */
    int updateConfirm(@Param("companyId") Long companyId, @Param("relateStampId") Long relateStampId,
                      @Param("confirmerId") Long confirmerId, @Param("confirmDate") LocalDate confirmDate);

    long selectNextPrintId();

    int deletePrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId, @Param("windowClassName") String windowClassName);

    /** Sys99_Print.insertRdStampList — selectBySearchText 목록을 sys99_print에 넣는다 */
    int insertStampListPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                             @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                             @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                             @Param("stampId") Long stampId, @Param("outYn") boolean outYn, @Param("searchText") String searchText);

    /** Sys99_Print.insertRdOrgStampList — selectByOrgCodeId 목록을 sys99_print에 넣는다 */
    int insertOrgStampListPrint(@Param("companyId") Long companyId, @Param("printPersonId") Long printPersonId,
                                @Param("windowClassName") String windowClassName, @Param("groupId") long groupId,
                                @Param("orgCodeId") Long orgCodeId, @Param("startDate") LocalDate startDate,
                                @Param("closeDate") LocalDate closeDate, @Param("stampId") Long stampId,
                                @Param("outYn") boolean outYn, @Param("searchText") String searchText);
}
