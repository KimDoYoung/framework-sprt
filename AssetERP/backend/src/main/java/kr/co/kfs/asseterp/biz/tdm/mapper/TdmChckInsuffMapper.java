package kr.co.kfs.asseterp.biz.tdm.mapper;

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
}
