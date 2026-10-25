package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffListRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRecordReq;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ChckInsuffSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** 미흡/개선 내역 (AS-IS server/tdm Tdm54_ChckInsuff) */
@Mapper
public interface TdmChckInsuffMapper {

    /** AS-IS tdm54_chck_insuff.selectByChckManlId */
    List<ChckInsuffRes> selectByChckManlId(@Param("chckManlId") Long chckManlId);

    /** AS-IS dbConfig.getSeq */
    Long selectNextId();

    /** AS-IS UpdateDataModel(tdm54_chck_insuff) 최초등록 — 회사·직책·부서·발생년월은 점검항목에서 */
    int insertInsuff(@Param("chckInsuffId") Long chckInsuffId, @Param("req") ChckInsuffSaveReq req, @Param("companyId") Long companyId,
                     @Param("roleId") Long roleId, @Param("orgId") Long orgId, @Param("planRegEmpId") Long planRegEmpId,
                     @Param("statusCode") String statusCode, @Param("occYm") String occYm, @Param("updName") String updName);

    /** AS-IS UpdateDataModel(tdm54_chck_insuff) 계획변경 — 사용자가 고치는 열만. 로그인 회사 행만 */
    int updateInsuff(@Param("req") ChckInsuffSaveReq req, @Param("companyId") Long companyId, @Param("updName") String updName);

    /** AS-IS tdm54_chck_insuff.selectByRegDate (N24 미흡내역 조치 목록) */
    List<ChckInsuffListRes> selectByRegDate(@Param("companyId") Long companyId, @Param("startDate") String startDate, @Param("endDate") String endDate,
                                            @Param("unDoneYn") boolean unDoneYn, @Param("roleId") Long roleId, @Param("orgId") Long orgId,
                                            @Param("statusCode") String statusCode);

    /** AS-IS tdm54_chck_insuff.selectById (N24 조치 창이 저장 뒤 다시 읽는 한 건) */
    ChckInsuffListRes selectById(@Param("chckInsuffId") Long chckInsuffId);

    /** AS-IS tdm51_chck_org.getTdmOrgId — 로그인 사용자의 현재 부서가 속한 책무 대상 부서 (AS-IS는 세션 부서, TOBE는 emp03_trans 최신 행) */
    Long selectTdmOrgId(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS tdm61_chck_insuff_appr.selectByChckInsuffId — 건수만 쓴다 */
    int countApprByChckInsuffId(@Param("chckInsuffId") Long chckInsuffId);

    /** AS-IS tdm63_chck_insuff_record.countEvid */
    int countEvid(@Param("chckInsuffId") Long chckInsuffId);

    /** AS-IS UpdateDataModel(tdm54_chck_insuff) 조치결과 — 상태·조치완료예정일·조치완료일·조치자·조치결과. 로그인 회사 행만 */
    int updateResult(@Param("chckInsuffId") Long chckInsuffId, @Param("companyId") Long companyId, @Param("statusCode") String statusCode,
                     @Param("dueDate") String dueDate, @Param("actionDate") String actionDate, @Param("actionEmpId") Long actionEmpId,
                     @Param("actionCmnt") String actionCmnt, @Param("updName") String updName);

    /** 조치기록이 이 미흡내역의 것인지 확인용 — AS-IS는 화면이 그리드에서 정한 행만 보냈다 */
    List<Long> selectRecordIds(@Param("chckInsuffId") Long chckInsuffId);

    /** AS-IS UpdateDataModel(tdm63_chck_insuff_record) INSERT */
    int insertRecord(@Param("id") Long id, @Param("chckInsuffId") Long chckInsuffId, @Param("row") ChckInsuffRecordReq row,
                     @Param("regEmpId") Long regEmpId, @Param("updName") String updName);

    /** AS-IS UpdateDataModel(tdm63_chck_insuff_record) UPDATE — 등록일·조치내용·비고 */
    int updateRecord(@Param("chckInsuffId") Long chckInsuffId, @Param("row") ChckInsuffRecordReq row, @Param("updName") String updName);

    /** AS-IS UpdateDataModel(tdm63_chck_insuff_record) DELETE */
    int deleteRecords(@Param("chckInsuffId") Long chckInsuffId, @Param("ids") List<Long> ids);
}
