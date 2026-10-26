package kr.co.kfs.asseterp.biz.est.mapper;

import kr.co.kfs.asseterp.biz.est.dto.PfFeeTypeRes;
import kr.co.kfs.asseterp.biz.est.dto.PfFeeTypeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/est/mapper/est01_pf_fee_type.xml + est02_pf_contract.checkList */
@Mapper
public interface EstPfFeeTypeMapper {
    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS est01_pf_fee_type.selectByCompanyId */
    List<PfFeeTypeRes> selectByCompanyId(@Param("companyId") Long companyId);

    /** AS-IS est01_pf_fee_type.selectByText — 조회창. startDate에 사용 중인 항목, searchText는 "%…%"(항목 이름+정의) */
    List<PfFeeTypeRes> selectByText(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate,
                                    @Param("searchText") String searchText);

    /** AS-IS est01_pf_fee_type.selectById — 로그인 회사 행만 */
    PfFeeTypeRes selectById(@Param("pfFeeTypeId") Long pfFeeTypeId, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel 동적 INSERT */
    int insertPfFeeType(@Param("id") Long pfFeeTypeId, @Param("companyId") Long companyId, @Param("r") PfFeeTypeSaveReq req);

    /** AS-IS UpdateDataModel 동적 UPDATE */
    int updatePfFeeType(@Param("companyId") Long companyId, @Param("r") PfFeeTypeSaveReq req);

    /** AS-IS UpdateDataModel.deleteModel */
    int deletePfFeeTypes(@Param("companyId") Long companyId, @Param("pfFeeTypeIds") List<Long> pfFeeTypeIds);

    /** AS-IS est02_pf_contract.checkList — 이 수수료 항목을 쓰는 용역계약 ID */
    List<Long> selectContractIdsByFeeTypes(@Param("pfFeeTypeIds") List<Long> pfFeeTypeIds);
}
